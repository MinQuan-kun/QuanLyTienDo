import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/main.css';

export default function SectionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  documentId
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetValue: 10,
    unit: '%',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        targetValue: initialData.targetValue || 10,
        unit: initialData.unit || '%',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        targetValue: 10,
        unit: '%',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetValue' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        documentId: initialData?.document || documentId,
      };
      await onSave(data);
      onClose();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Chỉnh Sửa Mục' : 'Thêm Mục Mới'}</h2>
          <button onClick={onClose} className="btn-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tên Mục *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nhập tên mục"
            />
          </div>

          <div className="form-group">
            <label>Mô Tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows="3"
              placeholder="Nhập mô tả"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Giá Trị Mục Tiêu *</label>
              <input
                type="number"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleChange}
                step="0.01"
                required
                disabled={loading}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Đơn Vị</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                disabled={loading}
                placeholder="%"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
