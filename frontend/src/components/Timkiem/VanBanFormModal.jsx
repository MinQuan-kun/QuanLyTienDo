import React, { useState, useEffect, useRef } from 'react';
import { FaUpload, FaFile, FaTimes } from 'react-icons/fa';

const LOAI_OPTIONS = ['Thành ủy', 'Đảng ủy'];
const LOAI_VAN_BAN = ['Báo cáo', 'Biên bản', 'Công văn', 'Kế hoạch', 'Nghị quyết', 'Quy định', 'Quyết định', 'Thông báo', 'Thư mời'];

const defaultForm = {
  loai: 'Thành ủy',
  soKyHieu: '',
  ngayVanBan: '',
  loaiVanBan: 'Công văn',
  trichYeu: '',
  nguoiKy: '',
  noiNhan: '',
  donViNhanBanLuu: '',
  soLuongBan: 1,
  ghiChu: '',
};

const VanBanFormModal = ({ isOpen, onClose, initialData, onSave, isSubmitting }) => {
  const [form, setForm] = useState(defaultForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeFile, setRemoveFile] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setRemoveFile(false);
      if (initialData) {
        setForm({
          loai: initialData.loai || 'Thành ủy',
          soKyHieu: initialData.soKyHieu || '',
          ngayVanBan: initialData.ngayVanBan
            ? new Date(initialData.ngayVanBan).toISOString().slice(0, 10)
            : '',
          loaiVanBan: initialData.loaiVanBan || 'Công văn',
          trichYeu: initialData.trichYeu || '',
          nguoiKy: initialData.nguoiKy || '',
          noiNhan: initialData.noiNhan || '',
          donViNhanBanLuu: initialData.donViNhanBanLuu || '',
          soLuongBan: initialData.soLuongBan ?? 1,
          ghiChu: initialData.ghiChu || '',
        });
      } else {
        setForm(defaultForm);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setRemoveFile(false);
    }
  };

  const handleSubmit = () => {
    if (!form.soKyHieu.trim()) {
      alert('Vui lòng nhập Số, ký hiệu văn bản');
      return;
    }
    if (!form.ngayVanBan) {
      alert('Vui lòng chọn Ngày văn bản');
      return;
    }

    // Build FormData để gửi cả text fields + file
    const fd = new FormData();
    Object.entries({ ...form, soLuongBan: Number(form.soLuongBan) || 1 }).forEach(([k, v]) => {
      fd.append(k, v);
    });
    if (selectedFile) {
      fd.append('file', selectedFile);
    }
    if (removeFile) {
      fd.append('removeFile', 'true');
    }

    onSave(fd);
  };

  if (!isOpen) return null;

  const isEditing = !!initialData;
  const hasExistingFile = isEditing && initialData?.driveFileId;

  return (
    <div className="tk-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tk-modal">
        <div className="tk-modal-header">
          <h3 className="tk-modal-title">
            {isEditing ? '✏️ Sửa văn bản' : '➕ Thêm văn bản mới'}
          </h3>
          <button className="tk-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="tk-modal-body">
          {/* Row 1: Loai + SoKyHieu + Ngay */}
          <div className="tk-form-row">
            <div className="tk-form-group" style={{ flex: '0 0 140px' }}>
              <label className="tk-form-label">
                Loại <span className="required">*</span>
              </label>
              <select
                className="tk-form-select"
                value={form.loai}
                onChange={e => handleChange('loai', e.target.value)}
              >
                {LOAI_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="tk-form-group">
              <label className="tk-form-label">
                Số, ký hiệu <span className="required">*</span>
              </label>
              <input
                className="tk-form-input"
                placeholder="VD: 12/CV-ĐU"
                value={form.soKyHieu}
                onChange={e => handleChange('soKyHieu', e.target.value)}
              />
            </div>
            <div className="tk-form-group" style={{ flex: '0 0 160px' }}>
              <label className="tk-form-label">
                Ngày văn bản <span className="required">*</span>
              </label>
              <input
                className="tk-form-input"
                type="date"
                value={form.ngayVanBan}
                onChange={e => handleChange('ngayVanBan', e.target.value)}
              />
            </div>
          </div>

          {/* LoaiVanBan */}
          <div className="tk-form-group">
            <label className="tk-form-label">
              Loại văn bản <span className="required">*</span>
            </label>
            <select
              className="tk-form-select"
              value={form.loaiVanBan}
              onChange={e => handleChange('loaiVanBan', e.target.value)}
            >
              {LOAI_VAN_BAN.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* TrichYeu */}
          <div className="tk-form-group">
            <label className="tk-form-label">Trích yếu nội dung</label>
            <textarea
              className="tk-form-textarea"
              placeholder="Nhập trích yếu nội dung văn bản..."
              value={form.trichYeu}
              onChange={e => handleChange('trichYeu', e.target.value)}
              rows={3}
            />
          </div>

          {/* NguoiKy + NoiNhan */}
          <div className="tk-form-row">
            <div className="tk-form-group">
              <label className="tk-form-label">Người ký</label>
              <input
                className="tk-form-input"
                placeholder="Họ tên người ký..."
                value={form.nguoiKy}
                onChange={e => handleChange('nguoiKy', e.target.value)}
              />
            </div>
            <div className="tk-form-group">
              <label className="tk-form-label">Nơi nhận</label>
              <input
                className="tk-form-input"
                placeholder="Nơi nhận văn bản..."
                value={form.noiNhan}
                onChange={e => handleChange('noiNhan', e.target.value)}
              />
            </div>
          </div>

          {/* DonViNhanBanLuu + SoLuongBan */}
          <div className="tk-form-row">
            <div className="tk-form-group">
              <label className="tk-form-label">Đơn vị nhận bản lưu</label>
              <input
                className="tk-form-input"
                placeholder="Đơn vị nhận..."
                value={form.donViNhanBanLuu}
                onChange={e => handleChange('donViNhanBanLuu', e.target.value)}
              />
            </div>
            <div className="tk-form-group" style={{ flex: '0 0 120px' }}>
              <label className="tk-form-label">Số lượng bản</label>
              <input
                className="tk-form-input"
                type="number"
                min={0}
                value={form.soLuongBan}
                onChange={e => handleChange('soLuongBan', e.target.value)}
              />
            </div>
          </div>

          {/* GhiChu */}
          <div className="tk-form-group">
            <label className="tk-form-label">Ghi chú</label>
            <input
              className="tk-form-input"
              placeholder="Ghi chú thêm (nếu có)..."
              value={form.ghiChu}
              onChange={e => handleChange('ghiChu', e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="tk-drive-link-group">
            <div className="tk-drive-link-label">
              <FaUpload /> Đính kèm file (PDF, Word, Excel...)
            </div>

            {/* Hiện file cũ nếu đang sửa */}
            {hasExistingFile && !removeFile && !selectedFile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: '#e3f2fd', borderRadius: 6, marginBottom: 8 }}>
                <FaFile style={{ color: '#1976d2' }} />
                <span style={{ fontSize: '0.82rem', color: '#1565c0', flex: 1 }}>{initialData.driveFileName || 'File đính kèm hiện tại'}</span>
                <button
                  onClick={() => setRemoveFile(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: 13 }}
                  title="Xóa file đính kèm"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            {removeFile && (
              <div style={{ fontSize: '0.78rem', color: '#e53935', marginBottom: 8 }}>
                ⚠️ File đính kèm hiện tại sẽ bị xóa khi lưu.{' '}
                <button onClick={() => setRemoveFile(false)} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.78rem' }}>Hoàn tác</button>
              </div>
            )}

            {/* Chọn file mới */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="tk-btn-cancel"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload /> Chọn file từ máy
              </button>
              {selectedFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2e7d32', fontSize: '0.82rem' }}>
                  <FaFile />
                  <span>{selectedFile.name}</span>
                  <span style={{ color: '#888' }}>({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); fileInputRef.current.value = ''; }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: 13 }}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 5 }}>
              📁 File sẽ được lưu tự động lên Google Drive của hệ thống. Tối đa 50MB.
            </div>
          </div>
        </div>

        <div className="tk-modal-footer">
          <button className="tk-btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '⏳ Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm văn bản')}
          </button>
          <button className="tk-btn-cancel" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default VanBanFormModal;
