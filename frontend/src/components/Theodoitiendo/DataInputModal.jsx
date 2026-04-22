import React from 'react';
import { X, Save } from 'lucide-react';

const DataInputModal = ({
  isOpen,
  onClose,
  mode, // 'document' hoặc 'progress'
  section,
  documentData, // { startDate, endDate }
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>
            {mode === 'document' ? 'Thêm nội dung mới' : `Nhập Tiến Độ: ${section?.name}`}
          </h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          {mode === 'document' ? (
            <div className="form-doc">
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Tên nội dung</label>
                <input type="text" style={{ width: '100%', padding: '10px' }} placeholder="VD: Nghị quyết Đại hội Đảng bộ xã..." />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Ngày bắt đầu</label>
                  <input type="date" style={{ width: '100%', padding: '10px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Ngày kết thúc</label>
                  <input type="date" style={{ width: '100%', padding: '10px' }} />
                </div>
              </div>
              <button className="btn-red" style={{ width: '100%', marginTop: '20px' }}>Lưu Nội dung</button>
            </div>
          ) : (
            <div className="data-table">
              {/* Bảng nhập dữ liệu hàng năm từ file mẫu */}
              <div className="table-header">
                <div className="col-year">Năm</div>
                <div className="col-value">Thực tế</div>
                <div className="col-target">Mục tiêu</div>
                <div className="col-actions"></div>
              </div>
              {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                <div className="table-row" key={year}>
                  <div className="col-year">{year}</div>
                  <div className="col-value"><input type="number" style={{ width: '80%' }} /></div>
                  <div className="col-target"><span>100%</span></div>
                  <div className="col-actions"><button style={{ color: 'green', background: 'none', border: 'none' }}><Save size={16} /></button></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataInputModal;