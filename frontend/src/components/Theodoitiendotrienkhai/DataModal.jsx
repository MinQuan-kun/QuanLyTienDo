import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const DataModal = ({ isOpen, onClose, title, onSubmit, initialData, type, parentId, parentType, nam }) => {
  const [formData, setFormData] = useState({
    soKyHieu: '',
    ngayVanBan: '',
    loaiVanBan: 'Công văn',
    trichYeu: '',
    nguoiKy: '',
    noiNhan: '',
    donViNhanBanLuu: '',
    soLuongBan: 1,
    ghiChu: '',
    loai: 'Đang triển khai',
  });
  const [file, setFile] = useState(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFilled = !!formData.soLuongBan;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          soKyHieu: initialData.soKyHieu || '',
          ngayVanBan: initialData.ngayVanBan ? new Date(initialData.ngayVanBan).toISOString().slice(0, 10) : '',
          loaiVanBan: initialData.loaiVanBan || 'Công văn',
          trichYeu: initialData.trichYeu || '',
          nguoiKy: initialData.nguoiKy || '',
          noiNhan: initialData.noiNhan || '',
          donViNhanBanLuu: initialData.donViNhanBanLuu || '',
          soLuongBan: initialData.soLuongBan ?? 1,
          ghiChu: initialData.ghiChu || '',
          loai: initialData.loai || 'Đang triển khai',
        });
        setFile(null);
        setRemoveFile(false);
      } else {
        setFormData({
          soKyHieu: '',
          ngayVanBan: '',
          loaiVanBan: 'Công văn',
          trichYeu: '',
          nguoiKy: '',
          noiNhan: '',
          donViNhanBanLuu: '',
          soLuongBan: 1,
          ghiChu: '',
          loai: type === 'ket-qua' ? (initialData?.loai || 'Đang triển khai') : 'Đang triển khai',
        });
        setFile(null);
        setRemoveFile(false);
      }
    }
  }, [isOpen, initialData, type]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('nam', nam);
    if (parentId) {
      if (type === 'thanh-uy') data.append('trungUongId', parentId);
      if (type === 'dang-uy') {
        if (parentType === 'trung-uong') data.append('trungUongId', parentId);
        else data.append('thanhUyId', parentId);
      }
      if (type === 'ket-qua') data.append('dangUyId', parentId);
    }

    data.append('ghiChu', formData.ghiChu);

    if (type === 'ket-qua') {
      data.append('loai', formData.loai);
      data.append('soKyHieu', formData.soKyHieu);
      data.append('ngayVanBan', formData.ngayVanBan);
      data.append('loaiVanBan', formData.loaiVanBan);
      data.append('trichYeu', formData.trichYeu);
      data.append('nguoiKy', formData.nguoiKy);
      data.append('noiNhan', formData.noiNhan);
      data.append('donViNhanBanLuu', formData.donViNhanBanLuu);
      data.append('soLuongBan', formData.soLuongBan);
    } else if (type === 'trung-uong' || type === 'thanh-uy') {
      data.append('soKyHieu', formData.soKyHieu);
      data.append('ngayVanBan', formData.ngayVanBan);
      data.append('loaiVanBan', formData.loaiVanBan);
      data.append('trichYeu', formData.trichYeu);
      data.append('nguoiKy', formData.nguoiKy);
      data.append('noiNhan', formData.noiNhan);
      data.append('donViNhanBanLuu', formData.donViNhanBanLuu);
      data.append('soLuongBan', formData.soLuongBan);
    }

    if (file) {
      data.append('file', file);
    }
    if (removeFile) {
      data.append('removeFile', 'true');
    }

    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isKetQua = type === 'ket-qua';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff', padding: '24px', borderRadius: '12px', width: '500px',
        maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {(type === 'trung-uong' || type === 'thanh-uy') && (
            <>
              <div className="tdttk-form-group" style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Số, ký hiệu <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.soKyHieu}
                    onChange={e => setFormData({ ...formData, soKyHieu: e.target.value })}
                    placeholder="VD: 12/CV-ĐU"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    Ngày văn bản
                  </label>

                  <input
                    type="date"
                    value={formData.ngayVanBan}
                    onChange={e => setFormData({ ...formData, ngayVanBan: e.target.value })}
                    style={{
                      color: formData.ngayVanBan ? '#334155' : '#94a3b8',
                      border: '1px solid',
                      borderColor: formData.ngayVanBan ? '#334155' : '#cbd5f5',
                      padding: '6px 10px',
                      borderRadius: '6px'
                    }}
                  />
                </div>
              </div>
              <div className="tdttk-form-group">
                <label>Loại văn bản <span style={{ color: 'red' }}>*</span></label>
                <select
                  value={formData.loaiVanBan}
                  onChange={e => setFormData({ ...formData, loaiVanBan: e.target.value })}
                >
                  {['Báo cáo', 'Biên bản', 'Công văn', 'Kế hoạch', 'Nghị quyết', 'Quy định', 'Quyết định', 'Thông báo', 'Thư mời'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="tdttk-form-group">
                <label>Trích yếu nội dung</label>
                <textarea
                  rows={3}
                  value={formData.trichYeu}
                  onChange={e => setFormData({ ...formData, trichYeu: e.target.value })}
                  placeholder="Nhập trích yếu..."
                />
              </div>
              <div className="tdttk-form-group" style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Người ký</label>
                  <input
                    type="text"
                    value={formData.nguoiKy}
                    onChange={e => setFormData({ ...formData, nguoiKy: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Nơi nhận</label>
                  <input
                    type="text"
                    value={formData.noiNhan}
                    onChange={e => setFormData({ ...formData, noiNhan: e.target.value })}
                  />
                </div>
              </div>
              <div className="tdttk-form-group" style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Đơn vị nhận bản lưu</label>
                  <input
                    type="text"
                    value={formData.donViNhanBanLuu}
                    onChange={e => setFormData({ ...formData, donViNhanBanLuu: e.target.value })}
                  />
                </div>
                <div style={{ flex: '0 0 100px' }}>
                  <label>Số lượng</label>

                  <input
                    type="number"
                    min="1"
                    value={formData.soLuongBan || ''}
                    onChange={e =>
                      setFormData({ ...formData, soLuongBan: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: `1px solid ${isFilled ? '#334155' : '#cbd5f5'}`,
                      color: isFilled ? '#334155' : '#94a3b8'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {type === 'dang-uy' && (
            <div className="tdttk-form-group">

            </div>
          )}

          {isKetQua && (
            <>
              <div className="tdttk-form-group">
                <label>Loại <span style={{ color: 'red' }}>*</span></label>
                <select
                  value={formData.loai}
                  onChange={e => setFormData({ ...formData, loai: e.target.value })}
                >
                  <option value="Đang triển khai">Đang triển khai</option>
                  <option value="Đã thực hiện">Đã thực hiện</option>
                  <option value="Ghi chú">Ghi chú</option>
                </select>
              </div>

              {/* Thông tin văn bản (tương tự Trung ương / Thành ủy) */}
              <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: '12px', paddingTop: '12px' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '10px' }}>Thông tin văn bản</p>
                <div className="tdttk-form-group" style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Số, ký hiệu</label>
                    <input
                      type="text"
                      value={formData.soKyHieu}
                      onChange={e => setFormData({ ...formData, soKyHieu: e.target.value })}
                      placeholder="VD: 12/CV-ĐU"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Ngày văn bản</label>
                    <input
                      type="date"
                      value={formData.ngayVanBan}
                      onChange={e => setFormData({ ...formData, ngayVanBan: e.target.value })}
                      style={{
                        color: formData.ngayVanBan ? '#334155' : '#94a3b8',
                        border: '1px solid',
                        borderColor: formData.ngayVanBan ? '#334155' : '#cbd5f5',
                        padding: '6px 10px',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </div>
                <div className="tdttk-form-group">
                  <label>Loại văn bản</label>
                  <select
                    value={formData.loaiVanBan}
                    onChange={e => setFormData({ ...formData, loaiVanBan: e.target.value })}
                  >
                    {['Báo cáo', 'Biên bản', 'Công văn', 'Kế hoạch', 'Nghị quyết', 'Quy định', 'Quyết định', 'Thông báo', 'Thư mời'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="tdttk-form-group">
                  <label>Trích yếu nội dung</label>
                  <textarea
                    rows={3}
                    value={formData.trichYeu}
                    onChange={e => setFormData({ ...formData, trichYeu: e.target.value })}
                    placeholder="Nhập trích yếu..."
                  />
                </div>
                <div className="tdttk-form-group" style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Người ký</label>
                    <input
                      type="text"
                      value={formData.nguoiKy}
                      onChange={e => setFormData({ ...formData, nguoiKy: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Nơi nhận</label>
                    <input
                      type="text"
                      value={formData.noiNhan}
                      onChange={e => setFormData({ ...formData, noiNhan: e.target.value })}
                    />
                  </div>
                </div>
                <div className="tdttk-form-group" style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Đơn vị nhận bản lưu</label>
                    <input
                      type="text"
                      value={formData.donViNhanBanLuu}
                      onChange={e => setFormData({ ...formData, donViNhanBanLuu: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: '0 0 100px' }}>
                    <label>Số lượng</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.soLuongBan || ''}
                      onChange={e => setFormData({ ...formData, soLuongBan: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${isFilled ? '#334155' : '#cbd5f5'}`,
                        color: isFilled ? '#334155' : '#94a3b8'
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="tdttk-form-group">
            <label>Ghi chú</label>
            <textarea
              rows={3}
              value={formData.ghiChu}
              onChange={e => setFormData({ ...formData, ghiChu: e.target.value })}
              placeholder="Nhập ghi chú (nếu có)..."
            />
          </div>

          <div className="tdttk-form-group">
            <label>
              Đính kèm file <span style={{ fontWeight: 'normal', fontSize: '0.8rem', color: '#64748b' }}>(Tùy chọn)</span>
            </label>
            <input
              type="file"
              onChange={e => setFile(e.target.files[0])}
            />

            {initialData?.driveFileId && (
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#475569' }}>
                File hiện tại:
                <a
                  href={`/api/tien-do-trien-khai/file/${type}/${initialData._id}/download?view=true`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#3b82f6', fontWeight: 600, marginLeft: '4px' }}
                >
                  {initialData.driveFileName}
                </a>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', cursor: 'pointer', fontWeight: 'normal', color: 'red' }}>
                  <input
                    type="checkbox"
                    checked={removeFile}
                    onChange={e => setRemoveFile(e.target.checked)}
                  />
                  Xóa file đính kèm này
                </label>
              </div>
            )}
          </div>

          <div className="tdttk-btn-group">
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataModal;
