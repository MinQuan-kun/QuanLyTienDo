const mongoose = require('mongoose');

const tdtkTrungUongSchema = new mongoose.Schema({
  nam: { type: Number, required: true },
  soKyHieu: { type: String, required: true },
  ngayVanBan: { type: Date },
  loaiVanBan: { type: String, default: 'Công văn' },
  trichYeu: { type: String, default: '' },
  nguoiKy: { type: String, default: '' },
  noiNhan: { type: String, default: '' },
  donViNhanBanLuu: { type: String, default: '' },
  soLuongBan: { type: Number, default: 1 },
  ghiChu: { type: String, default: '' },
  driveFileId: { type: String, default: '' },
  driveFileName: { type: String, default: '' },
  fileUrl: { type: String, default: '' }
}, { timestamps: true });

const tdtkThanhUySchema = new mongoose.Schema({
  trungUongId: { type: mongoose.Schema.Types.ObjectId, ref: 'TDTK_TrungUong', required: true },
  nam: { type: Number, required: true },
  soKyHieu: { type: String, required: true },
  ngayVanBan: { type: Date },
  loaiVanBan: { type: String, default: 'Công văn' },
  trichYeu: { type: String, default: '' },
  nguoiKy: { type: String, default: '' },
  noiNhan: { type: String, default: '' },
  donViNhanBanLuu: { type: String, default: '' },
  soLuongBan: { type: Number, default: 1 },
  ghiChu: { type: String, default: '' },
  driveFileId: { type: String, default: '' },
  driveFileName: { type: String, default: '' },
  fileUrl: { type: String, default: '' }
}, { timestamps: true });

const tdtkDangUySchema = new mongoose.Schema({
  trungUongId: { type: mongoose.Schema.Types.ObjectId, ref: 'TDTK_TrungUong' },
  thanhUyId: { type: mongoose.Schema.Types.ObjectId, ref: 'TDTK_ThanhUy' },
  nam: { type: Number, required: true },
  tenVanBan: { type: String, default: 'Đảng ủy' }, // Optional text
  ghiChu: { type: String, default: '' },
  driveFileId: { type: String, default: '' },
  driveFileName: { type: String, default: '' },
  fileUrl: { type: String, default: '' }
}, { timestamps: true });

const tdtkKetQuaSchema = new mongoose.Schema({
  dangUyId: { type: mongoose.Schema.Types.ObjectId, ref: 'TDTK_DangUy', required: true },
  nam: { type: Number, required: true },
  loai: { type: String, enum: ['Đang triển khai', 'Đã thực hiện', 'Ghi chú'], required: true },
  soKyHieu: { type: String, default: '' },
  ngayVanBan: { type: Date },
  loaiVanBan: { type: String, default: 'Công văn' },
  trichYeu: { type: String, default: '' },
  nguoiKy: { type: String, default: '' },
  noiNhan: { type: String, default: '' },
  donViNhanBanLuu: { type: String, default: '' },
  soLuongBan: { type: Number, default: 1 },
  ghiChu: { type: String, default: '' },
  driveFileId: { type: String, default: '' },
  driveFileName: { type: String, default: '' },
  fileUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = {
  TDTK_TrungUong: mongoose.model('TDTK_TrungUong', tdtkTrungUongSchema),
  TDTK_ThanhUy: mongoose.model('TDTK_ThanhUy', tdtkThanhUySchema),
  TDTK_DangUy: mongoose.model('TDTK_DangUy', tdtkDangUySchema),
  TDTK_KetQua: mongoose.model('TDTK_KetQua', tdtkKetQuaSchema)
};
