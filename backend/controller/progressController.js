const Document = require('../model/Document');
const Section = require('../model/Section');
const YearlyProgress = require('../model/YearlyProgress');
const Project = require('../model/Project');
const { uploadFileToDrive, deleteFileFromDrive } = require('../middleware/driveService');

// ===== PROJECT CONTROLLERS =====

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Vui lòng cung cấp tên Chủ đề (Project)' });
    
    const newProject = new Project({ name, description });
    await newProject.save();
    
    res.status(201).json({ message: 'Tạo chủ đề thành công', data: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, updatedAt: Date.now() },
      { returnDocument: 'after' }
    );
    if (!project) return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
    res.status(200).json({ message: 'Cập nhật thành công', data: project });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: 'Không tìm thấy chủ đề' });

    // Cascade delete: xóa tất cả documents, sections, yearly data thuộc project
    const docs = await Document.find({ projectId: id });
    for (const doc of docs) {
      // Xóa yearly data của các section thuộc document
      await YearlyProgress.deleteMany({ section: { $in: doc.sections } });
      // Xóa sections thuộc document
      await Section.deleteMany({ document: doc._id });
    }
    // Xóa tất cả documents thuộc project
    await Document.deleteMany({ projectId: id });

    res.status(200).json({ message: 'Xóa chủ đề và toàn bộ dữ liệu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ===== DOCUMENT CONTROLLERS =====

exports.createDocument = async (req, res) => {
  try {
    const { name, description, category, startDate, endDate, projectId } = req.body;

    if (!name || !category || !startDate || !endDate) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    let driveFileId = '';
    let driveFileName = '';
    let fileUrl = '';

    if (req.file) {
      driveFileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
      const uploadResult = await uploadFileToDrive(req.file.buffer, driveFileName, req.file.mimetype);
      driveFileId = uploadResult.fileId;
      fileUrl = uploadResult.webViewLink || '';
    }

    const newDocument = new Document({
      name,
      description,
      category,
      startDate,
      endDate,
      projectId,
      driveFileId,
      driveFileName,
      fileUrl
    });

    await newDocument.save();
    res.status(201).json({ message: 'Tạo văn bản thành công', data: newDocument });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const { category, search, projectId } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (projectId) {
      query.projectId = projectId;
    }

    // Support for filtering records that have NO projectId (unclassified default)
    if (projectId === 'unclassified') {
      query.projectId = { $exists: false };
    }

    const documents = await Document.find(query)
      .populate('sections')
      .sort({ createdAt: -1 });

    res.status(200).json({ data: documents });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id)
      .populate({
        path: 'sections',
        populate: {
          path: 'yearlyData',
        },
      });

    if (!document) {
      return res.status(404).json({ message: 'Không tìm thấy văn bản' });
    }

    res.status(200).json({ data: document });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, startDate, endDate, projectId } = req.body;

    const existing = await Document.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Không tìm thấy văn bản' });
    }

    const updateData = { 
      name, 
      description, 
      category, 
      startDate, 
      endDate, 
      projectId, 
      updatedAt: Date.now() 
    };

    if (req.file) {
      if (existing.driveFileId) {
        await deleteFileFromDrive(existing.driveFileId);
      }
      const newFileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
      const uploadResult = await uploadFileToDrive(req.file.buffer, newFileName, req.file.mimetype);
      updateData.driveFileId = uploadResult.fileId;
      updateData.driveFileName = newFileName;
      updateData.fileUrl = uploadResult.webViewLink || existing.fileUrl;
    }

    if (req.body.removeFile === 'true') {
      if (existing.driveFileId) {
        await deleteFileFromDrive(existing.driveFileId);
      }
      updateData.driveFileId = '';
      updateData.driveFileName = '';
      updateData.fileUrl = '';
    }

    const document = await Document.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after' }
    );

    res.status(200).json({ message: 'Cập nhật thành công', data: document });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({ message: 'Không tìm thấy văn bản' });
    }

    if (document.driveFileId) {
      await deleteFileFromDrive(document.driveFileId);
    }

    // Delete all sections and yearly data
    await Section.deleteMany({ document: id });
    await YearlyProgress.deleteMany({ section: { $in: document.sections } });

    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ===== SECTION CONTROLLERS =====

exports.createSection = async (req, res) => {
  try {
    const { name, description, targetValue, unit, order, documentId } = req.body;

    if (!name || !targetValue || !documentId) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    const section = new Section({
      name,
      description,
      targetValue,
      unit: unit || '%',
      order: order !== undefined ? Number(order) : 0,
      document: documentId,
    });

    await section.save();

    // Add section to document
    await Document.findByIdAndUpdate(
      documentId,
      { $push: { sections: section._id } },
      { returnDocument: 'after' }
    );

    res.status(201).json({ message: 'Tạo mục thành công', data: section });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getSectionsByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const sections = await Section.find({ document: documentId })
      .populate('yearlyData')
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({ data: sections });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, targetValue, unit, order } = req.body;

    const existingSection = await Section.findById(id);
    if (!existingSection) {
      return res.status(404).json({ message: 'Không tìm thấy mục' });
    }

    const updateData = {
      name, 
      description, 
      targetValue, 
      unit, 
      order: order !== undefined ? Number(order) : 0, 
      updatedAt: Date.now() 
    };

    const section = await Section.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after' }
    ).populate('yearlyData');

    res.status(200).json({ message: 'Cập nhật thành công', data: section });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findByIdAndDelete(id);

    if (!section) {
      return res.status(404).json({ message: 'Không tìm thấy mục' });
    }

    if (section.driveFileId) {
      await deleteFileFromDrive(section.driveFileId);
    }

    // Remove section from document
    await Document.findByIdAndUpdate(
      section.document,
      { $pull: { sections: id } },
      { returnDocument: 'after' }
    );

    // Delete all yearly data
    await YearlyProgress.deleteMany({ section: id });

    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ===== YEARLY PROGRESS CONTROLLERS =====

exports.createOrUpdateYearlyProgress = async (req, res) => {
  try {
    const { sectionId, year, actualValue, targetValue, note } = req.body;

    if (!sectionId || !year || actualValue === undefined) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    // Find existing progress or create new
    let progress = await YearlyProgress.findOne({
      section: sectionId,
      year: year,
    });

    if (progress) {
      progress.actualValue = actualValue;
      if (targetValue !== undefined) progress.targetValue = targetValue;
      progress.note = note || progress.note;
      progress.updatedAt = Date.now();
      await progress.save();
    } else {
      progress = new YearlyProgress({
        section: sectionId,
        year,
        actualValue,
        targetValue: targetValue !== undefined ? targetValue : undefined,
        note,
      });
      await progress.save();

      // Add progress to section
      await Section.findByIdAndUpdate(
        sectionId,
        { $push: { yearlyData: progress._id } },
        { returnDocument: 'after' }
      );
    }

    res.status(201).json({ message: 'Cập nhật dữ liệu thành công', data: progress });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getYearlyProgressBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const progressList = await YearlyProgress.find({ section: sectionId }).sort({
      year: 1,
    });

    res.status(200).json({ data: progressList });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteYearlyProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const progress = await YearlyProgress.findByIdAndDelete(id);

    if (!progress) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
    }

    // Remove from section
    await Section.findByIdAndUpdate(
      progress.section,
      { $pull: { yearlyData: id } },
      { returnDocument: 'after' }
    );

    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
