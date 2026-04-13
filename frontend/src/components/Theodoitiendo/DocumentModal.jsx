import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../styles/main.css';

export default function DocumentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  categories 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Kinh tế',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDate())
      .toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || 'Kinh tế',
        startDate: new Date(initialData.startDate).toISOString().split('T')[0],
        endDate: new Date(initialData.endDate).toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
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
          <h2>{initialData ? 'Chỉnh Sửa Văn Bản' : 'Thêm Văn Bản Mới'}</h2>
          <button onClick={onClose} className="btn-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tên Văn Bản *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nhập tên văn bản"
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
              <label>Thể Loại *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ngày Bắt Đầu *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Ngày Kết Thúc *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                disabled={loading}
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
