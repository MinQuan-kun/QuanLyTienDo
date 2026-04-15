import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DocumentList = ({ docs, activeProjectName, onSelect, selectedId, isEditable, isAdmin, onAddDoc, onEditDoc, onDeleteDoc }) => {

  const getCategoryClass = (category) => {
    const map = {
      'Kinh tế': 'cat-kinhte',
      'Xã hội': 'cat-xahoi',
      'Môi trường': 'cat-moitruong',
      'Giáo dục': 'cat-giaoduc',
      'Y tế': 'cat-yte',
      'Khác': 'cat-khac',
    };
    return map[category] || 'cat-khac';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <>
      {/* Panel Header */}
      <div className="tdt-panel-header">
        <h2 className="tdt-panel-title" style={{ fontSize: '0.9rem' }}> Nội dung:</h2>
        {isEditable && (
          <button className="tdt-btn-add" onClick={onAddDoc}>
            + Thêm
          </button>
        )}
      </div>

      {/* Document List */}
      <div className="tdt-doc-list">
        {docs.length === 0 && (
          <div className="tdt-doc-empty">Chưa có nội dung nào</div>
        )}
        {docs.map(doc => (
          <div
            key={doc._id}
            className={`tdt-doc-item tdt-animate-in ${selectedId === doc._id ? 'active' : ''}`}
            onClick={() => onSelect(doc)}
          >
            <div className="tdt-doc-item-header">
              <span className="tdt-doc-name">{doc.name || `[Nội dung]`}</span>
              {isEditable && (
                <div className="tdt-doc-actions">
                  <button
                    className="tdt-btn-icon edit"
                    title="Chỉnh sửa"
                    onClick={(e) => { e.stopPropagation(); onEditDoc && onEditDoc(doc); }}
                  >
                    <FaEdit />
                  </button>
                  {isAdmin && (
                    <button
                      className="tdt-btn-icon delete"
                      title="Xóa"
                      onClick={(e) => { e.stopPropagation(); onDeleteDoc && onDeleteDoc(doc._id); }}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>
              <span className={`tdt-doc-category ${getCategoryClass(doc.category)}`}>
                {doc.category}
              </span>
            </div>
            <div className="tdt-doc-dates">
              {formatDate(doc.startDate)} - {formatDate(doc.endDate)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DocumentList;