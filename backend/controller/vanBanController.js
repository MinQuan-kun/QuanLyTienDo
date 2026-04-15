const multer = require('multer');
const VanBan = require('../model/VanBan');
const { uploadFileToDrive, getFileStream, deleteFileFromDrive } = require('../middleware/driveService');

const path = require('path');
const fs = require('fs');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

exports.uploadMiddleware = upload.single('file');

exports.getAll = async (req, res) => {
  try {
    const { loai, search } = req.query;
    let query = {};

    if (loai && loai !== 'Tất cả') {
      query.loai = loai;
    }
    if (search) {
      query.$or = [
        { soKyHieu: { $regex: search, $options: 'i' } },
        { trichYeu: { $regex: search, $options: 'i' } },
        { nguoiKy: { $regex: search, $options: 'i' } },
        { noiNhan: { $regex: search, $options: 'i' } },
      ];
    }

    const vanBans = await VanBan.find(query).sort({ ngayVanBan: -1 });
    res.status(200).json({ data: vanBans });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// GET by ID — public
exports.getById = async (req, res) => {
  try {
    const vanBan = await VanBan.findById(req.params.id);
    if (!vanBan) return res.status(404).json({ message: 'Không tìm thấy văn bản' });
    res.status(200).json({ data: vanBan });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { loai, soKyHieu, ngayVanBan, loaiVanBan, trichYeu, nguoiKy, noiNhan, donViNhanBanLuu, soLuongBan, ghiChu } = req.body;

    if (!loai || !soKyHieu || !ngayVanBan || !loaiVanBan) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
    }

    let driveFileId = '';
    let driveFileName = '';

    // Upload trực tiếp lên Google Drive
    if (req.file) {
      driveFileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
      const uploadResult = await uploadFileToDrive(req.file.buffer, driveFileName, req.file.mimetype);
      driveFileId = uploadResult.fileId;
    }

    const newVanBan = new VanBan({
      loai, soKyHieu, ngayVanBan, loaiVanBan,
      trichYeu, nguoiKy, noiNhan, donViNhanBanLuu,
      soLuongBan: soLuongBan || 1,
      ghiChu,
      driveFileId,
      driveFileName,
    });

    await newVanBan.save();
    res.status(201).json({ message: 'Tạo văn bản thành công', data: newVanBan });
  } catch (error) {
    console.error('Lỗi upload create:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// PUT update — requires login
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await VanBan.findById(id);
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy văn bản' });

    const updateData = { ...req.body };

    // Nếu có file mới upload
    if (req.file) {
      // Xóa file cũ trên Google Drive nếu có
      if (existing.driveFileId) {
        await deleteFileFromDrive(existing.driveFileId);
      }

      const newFileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
      const uploadResult = await uploadFileToDrive(req.file.buffer, newFileName, req.file.mimetype);

      updateData.driveFileId = uploadResult.fileId;
      updateData.driveFileName = newFileName;
    }

    // Nếu muốn xóa file đính kèm (gửi removeFile=true)
    if (req.body.removeFile === 'true') {
      if (existing.driveFileId) {
        await deleteFileFromDrive(existing.driveFileId);
      }
      updateData.driveFileId = '';
      updateData.driveFileName = '';
    }

    const vanBan = await VanBan.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json({ message: 'Cập nhật thành công', data: vanBan });
  } catch (error) {
    console.error('Lỗi upload update:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// DELETE — admin only
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const vanBan = await VanBan.findByIdAndDelete(id);
    if (!vanBan) return res.status(404).json({ message: 'Không tìm thấy văn bản' });

    // Xóa file trên Google Drive nếu có
    if (vanBan.driveFileId) {
      await deleteFileFromDrive(vanBan.driveFileId);
    }

    res.status(200).json({ message: 'Xóa văn bản thành công' });
  } catch (error) {
    console.error('Lỗi xóa file:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// GET download proxy — public, stream file từ Google Drive
exports.download = async (req, res) => {
  try {
    const { id } = req.params;
    const vanBan = await VanBan.findById(id);

    if (!vanBan || !vanBan.driveFileId) {
      return res.status(404).json({ message: 'Văn bản này chưa có file đính kèm' });
    }

    const driveStreamData = await getFileStream(vanBan.driveFileId);

    res.setHeader('Content-Type', driveStreamData.mimeType);

    const isView = req.query.view === 'true';
    if (!isView) {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(vanBan.driveFileName)}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(vanBan.driveFileName)}"`);
    }

    if (driveStreamData.size) {
      res.setHeader('Content-Length', driveStreamData.size);
    }

    driveStreamData.stream.pipe(res);
  } catch (error) {
    console.error('Lỗi tải từ Google Drive:', error);
    res.status(500).json({ message: 'Lỗi tải file hoặc file không còn tồn tại trên hệ thống', error: error.message });
  }
};
