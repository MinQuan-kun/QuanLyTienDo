const Document = require('../model/Document');
const Section = require('../model/Section');
const YearlyProgress = require('../model/YearlyProgress');

// ===== DOCUMENT CONTROLLERS =====

exports.createDocument = async (req, res) => {
  try {
    const { name, description, category, startDate, endDate } = req.body;

    if (!name || !category || !startDate || !endDate) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    const newDocument = new Document({
      name,
      description,
      category,
      startDate,
      endDate,
    });

    await newDocument.save();
    res.status(201).json({ message: 'Tạo văn bản thành công', data: newDocument });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
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
    const { name, description, category, startDate, endDate } = req.body;

    const document = await Document.findByIdAndUpdate(
      id,
      { name, description, category, startDate, endDate, updatedAt: Date.now() },
      { returnDocument: 'after' }
    );

    if (!document) {
      return res.status(404).json({ message: 'Không tìm thấy văn bản' });
    }

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
    const { name, description, targetValue, unit, documentId } = req.body;

    if (!name || !targetValue || !documentId) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    const section = new Section({
      name,
      description,
      targetValue,
      unit: unit || '%',
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
      .sort({ createdAt: -1 });

    res.status(200).json({ data: sections });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, targetValue, unit } = req.body;

    const section = await Section.findByIdAndUpdate(
      id,
      { name, description, targetValue, unit, updatedAt: Date.now() },
      { returnDocument: 'after' }
    ).populate('yearlyData');

    if (!section) {
      return res.status(404).json({ message: 'Không tìm thấy mục' });
    }

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
