const multer = require('multer');
const { TDTK_TrungUong, TDTK_ThanhUy, TDTK_DangUy, TDTK_KetQua } = require('../model/TienDoTrienKhai');
const { uploadFileToDrive, getFileStream, deleteFileFromDrive } = require('../middleware/driveService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

exports.uploadMiddleware = upload.single('file');

// Lấy toàn bộ dữ liệu theo năm
exports.getAllByYear = async (req, res) => {
  try {
    const { nam } = req.params;
    if (!nam) return res.status(400).json({ message: 'Thiếu thông tin năm' });

    const trungUong = await TDTK_TrungUong.find({ nam }).sort({ createdAt: 1 });
    const thanhUy = await TDTK_ThanhUy.find({ nam }).sort({ createdAt: 1 });
    const dangUy = await TDTK_DangUy.find({ nam }).sort({ createdAt: 1 });
    const ketQua = await TDTK_KetQua.find({ nam }).sort({ createdAt: 1 });

    res.status(200).json({ data: { trungUong, thanhUy, dangUy, ketQua } });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Hàm tiện ích xử lý upload file
const handleFileUpload = async (file, year, type) => {
  if (!file) return { driveFileId: '', driveFileName: '' };
  const driveFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
  const uploadResult = await uploadFileToDrive(file.buffer, driveFileName, file.mimetype, year, type);
  return { driveFileId: uploadResult.fileId, driveFileName };
};

// === TRUNG ƯƠNG ===
exports.createTrungUong = async (req, res) => {
  try {
    const { nam, soKyHieu, ngayVanBan, loaiVanBan, trichYeu, nguoiKy, noiNhan, donViNhanBanLuu, soLuongBan, ghiChu } = req.body;
    if (!nam || !soKyHieu) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    

    const fileData = await handleFileUpload(req.file, nam, 'Trung ương');
    const doc = new TDTK_TrungUong({ nam, soKyHieu, ngayVanBan, loaiVanBan, trichYeu, nguoiKy, noiNhan, donViNhanBanLuu, soLuongBan, ghiChu, ...fileData });
    await doc.save();
    res.status(201).json({ message: 'Tạo thành công', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateTrungUong = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TDTK_TrungUong.findById(id);
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy' });

    const updateData = { ...req.body };
    if (req.file) {
      if (existing.driveFileId) await deleteFileFromDrive(existing.driveFileId);
      const fileData = await handleFileUpload(req.file, existing.nam, 'Trung ương');
      updateData.driveFileId = fileData.driveFileId;
      updateData.driveFileName = fileData.driveFileName;
    }

    if (req.body.removeFile === 'true' && existing.driveFileId) {
      await deleteFileFromDrive(existing.driveFileId);
      updateData.driveFileId = '';
      updateData.driveFileName = '';
    }

    const doc = await TDTK_TrungUong.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: 'Cập nhật thành công', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteTrungUong = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await TDTK_TrungUong.findByIdAndDelete(id);
    if (doc?.driveFileId) await deleteFileFromDrive(doc.driveFileId);
    
    // Xóa cascade có thể làm ở DB hoặc làm frontend gọi API. Ở đây ta có thể dùng schema pre-remove, 
    // nhưng để đơn giản, ta chỉ xóa node này. Các node con mồ côi frontend có thể lọc hoặc xử lý sau.
    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// === THÀNH ỦY ===
exports.createThanhUy = async (req, res) => {
  try {
    const { trungUongId, nam, soKyHieu, ngayVanBan, loaiVanBan, trichYeu, nguoiKy, noiNhan, donViNhanBanLuu, soLuongBan, ghiChu } = req.body;
    if (!trungUongId || !nam || !soKyHieu) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

    const fileData = await handleFileUpload(req.file, nam, 'Thành ủy');
    const doc = new TDTK_ThanhUy({ trungUongId, nam, soKyHieu, ngayVanBan, loaiVanBan, trichYeu, nguoiKy, noiNhan, donViNhanBanLuu, soLuongBan, ghiChu, ...fileData });
    await doc.save();
    res.status(201).json({ message: 'Tạo thành công', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateThanhUy = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TDTK_ThanhUy.findById(id);
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy' });

    const updateData = { ...req.body };
    if (req.file) {
      if (existing.driveFileId) await deleteFileFromDrive(existing.driveFileId);
      const fileData = await handleFileUpload(req.file, existing.nam, 'Thành ủy');
      updateData.driveFileId = fileData.driveFileId;
      updateData.driveFileName = fileData.driveFileName;
    }
    if (req.body.removeFile === 'true' && existing.driveFileId) {
      await deleteFileFromDrive(existing.driveFileId);
      updateData.driveFileId = '';
      updateData.driveFileName = '';
    }

    const doc = await TDTK_ThanhUy.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: 'Cập nhật thành công', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteThanhUy = async (req, res) => {
  try {
    const doc = await TDTK_ThanhUy.findByIdAndDelete(req.params.id);
    if (doc?.driveFileId) await deleteFileFromDrive(doc.driveFileId);
    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// === ĐẢNG ỦY ===
exports.createDangUy = async (req, res) => {
  try {
    const { trungUongId, thanhUyId, nam, ghiChu } = req.body;
    if ((!trungUongId && !thanhUyId) || !nam) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

    const fileData = await handleFileUpload(req.file, nam, 'Đảng ủy');
    const doc = new TDTK_DangUy({ trungUongId, thanhUyId, nam, ghiChu, ...fileData });
    await doc.save();
    res.status(201).json({ message: 'Tạo thành công', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateDangUy = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TDTK_DangUy.findById(id);
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy' });

    const updateData = { ...req.body };
    if (req.file) {
      if (existing.driveFileId) await deleteFileFromDrive(existing.driveFileId);
      const fileData = await handleFileUpload(req.file, existing.nam, 'Đảng ủy');
      updateData.driveFileId = fileData.driveFileId;
      updateData.driveFileName = fileData.driveFileName;
    }
    if (req.body.removeFile === 'true' && existing.driveFileId) {
      await deleteFileFromDrive(existing.driveFileId);
      updateData.driveFileId = '';
      updateData.driveFileName = '';
    }

    const doc = await TDTK_DangUy.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: 'Cập nhật thành công', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteDangUy = async (req, res) => {
  try {
    const doc = await TDTK_DangUy.findByIdAndDelete(req.params.id);
    if (doc?.driveFileId) await deleteFileFromDrive(doc.driveFileId);
    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// === KẾT QUẢ ===
exports.createKetQua = async (req, res) => {
  try {
    const { dangUyId, nam, loai, noiDung, ghiChu } = req.body;
    if (!dangUyId || !nam || !loai || !noiDung) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

    const fileData = await handleFileUpload(req.file, nam, 'Kết quả');
    const doc = new TDTK_KetQua({ dangUyId, nam, loai, noiDung, ghiChu, ...fileData });
    await doc.save();
    res.status(201).json({ message: 'Tạo thành công', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateKetQua = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TDTK_KetQua.findById(id);
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy' });

    const updateData = { ...req.body };
    if (req.file) {
      if (existing.driveFileId) await deleteFileFromDrive(existing.driveFileId);
      const fileData = await handleFileUpload(req.file, existing.nam, 'Kết quả');
      updateData.driveFileId = fileData.driveFileId;
      updateData.driveFileName = fileData.driveFileName;
    }
    if (req.body.removeFile === 'true' && existing.driveFileId) {
      await deleteFileFromDrive(existing.driveFileId);
      updateData.driveFileId = '';
      updateData.driveFileName = '';
    }

    const doc = await TDTK_KetQua.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: 'Cập nhật thành công', data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteKetQua = async (req, res) => {
  try {
    const doc = await TDTK_KetQua.findByIdAndDelete(req.params.id);
    if (doc?.driveFileId) await deleteFileFromDrive(doc.driveFileId);
    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// GET download proxy (Tương tự văn bản chung)
exports.downloadFile = async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;
    if (type === 'trung-uong') Model = TDTK_TrungUong;
    else if (type === 'thanh-uy') Model = TDTK_ThanhUy;
    else if (type === 'dang-uy') Model = TDTK_DangUy;
    else if (type === 'ket-qua') Model = TDTK_KetQua;
    else return res.status(400).json({ message: 'Loại không hợp lệ' });

    const doc = await Model.findById(id);
    if (!doc || !doc.driveFileId) return res.status(404).json({ message: 'Không tìm thấy file' });

    const driveStreamData = await getFileStream(doc.driveFileId);
    res.setHeader('Content-Type', driveStreamData.mimeType);

    const isView = req.query.view === 'true';
    if (!isView) {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.driveFileName)}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.driveFileName)}"`);
    }

    if (driveStreamData.size) {
      res.setHeader('Content-Length', driveStreamData.size);
    }
    driveStreamData.stream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tải file', error: error.message });
  }
};
