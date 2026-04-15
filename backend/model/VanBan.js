const mongoose = require('mongoose');

const vanBanSchema = new mongoose.Schema({
  loai: {
    type: String,
    enum: ['Thành ủy', 'Đảng ủy'],
    required: [true, 'Vui lòng chọn loại (Thành ủy / Đảng ủy)']
  },
  soKyHieu: {
    type: String,
    required: [true, 'Vui lòng nhập số, ký hiệu văn bản'],
    trim: true
  },
  ngayVanBan: {
    type: Date,
    required: [true, 'Vui lòng nhập ngày văn bản']
  },
  loaiVanBan: {
    type: String,
    enum: ['Báo cáo', 'Biên bản', 'Công văn', 'Kế hoạch', 'Nghị quyết', 'Quy định', 'Quyết định', 'Thông báo', 'Thư mời'],
    required: [true, 'Vui lòng chọn loại văn bản']
  },
  trichYeu: {
    type: String,
    trim: true,
    default: ''
  },
  nguoiKy: {
    type: String,
    trim: true,
    default: ''
  },
  noiNhan: {
    type: String,
    trim: true,
    default: ''
  },
  donViNhanBanLuu: {
    type: String,
    trim: true,
    default: ''
  },
  soLuongBan: {
    type: Number,
    default: 1,
    min: 0
  },
  ghiChu: {
    type: String,
    trim: true,
    default: ''
  },
  driveFileId: {
    type: String,
    trim: true,
    default: ''
  },
  driveFileName: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('VanBan', vanBanSchema);
