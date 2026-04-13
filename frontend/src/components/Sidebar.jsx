import { Trash2, Edit2, Plus } from 'lucide-react';
import '../styles/main.css';

export default function Sidebar({ 
  sections, 
  selectedSection, 
  onSelectSection, 
  onAddSection,
  onEditSection,
  onDeleteSection,
  loading 
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Các Mục Tiêu</h2>
        <button onClick={onAddSection} className="btn-add-section">
          <Plus size={20} />
          Thêm Mục
        </button>
      </div>

      <div className="sections-list">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : sections.length === 0 ? (
          <div className="empty-state">Chưa có mục nào</div>
        ) : (
          sections.map(section => (
            <div
              key={section._id}
              className={`section-item ${selectedSection?._id === section._id ? 'active' : ''}`}
              onClick={() => onSelectSection(section)}
            >
              <div className="section-info">
                <h3>{section.name}</h3>
                <p className="target">
                  Mục tiêu: {section.targetValue}{section.unit}
                </p>
              </div>
              <div className="section-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSection(section);
                  }}
                  className="btn-icon edit"
                  title="Chỉnh sửa"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Bạn chắc chắn muốn xóa?')) {
                      onDeleteSection(section._id);
                    }
                  }}
                  className="btn-icon delete"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
