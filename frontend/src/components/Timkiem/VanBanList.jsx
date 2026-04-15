import React from 'react';
import { FaEdit, FaTrash, FaDownload, FaPaperclip, FaEye } from 'react-icons/fa';
import { vanBanAPI } from '../../api/api';

const LOAI_OPTIONS = ['Tất cả', 'Thành ủy', 'Đảng ủy'];

const VanBanList = ({
  items,
  selectedId,
  onSelect,
  filterLoai,
  onFilterLoai,
  isEditable,
  isAdmin,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const counts = {
    'Tất cả': items.length,
    'Thành ủy': items.filter(v => v.loai === 'Thành ủy').length,
    'Đảng ủy': items.filter(v => v.loai === 'Đảng ủy').length,
  };

  const filtered = filterLoai === 'Tất cả'
    ? items
    : items.filter(v => v.loai === filterLoai);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('vi-VN');
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="tk-filter-tabs">
        {LOAI_OPTIONS.map(opt => (
          <button
            key={opt}
            className={`tk-filter-tab ${filterLoai === opt ? 'active' : ''}`}
            onClick={() => onFilterLoai(opt)}
          >
            {opt}
            <span className="tk-tab-count">{counts[opt]}</span>
          </button>
        ))}
      </div>

      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          Danh sách ({filtered.length})
        </span>
        {isEditable && (
          <button className="tk-btn-add" onClick={onAdd} style={{ padding: '5px 12px', fontSize: '0.75rem' }}>
            + Thêm
          </button>
        )}
      </div>

      {/* List */}
      <div className="tk-list">
        {filtered.length === 0 && (
          <div className="tk-list-empty">Chưa có văn bản nào</div>
        )}
        {filtered.map(item => (
          <div
            key={item._id}
            className={`tk-item ${selectedId === item._id ? 'active' : ''}`}
            onClick={() => onSelect(item)}
          >
            {/* Header row */}
            <div className="tk-item-header">
              <span className="tk-item-code">{item.soKyHieu}</span>
              <div className="tk-item-actions" onClick={e => e.stopPropagation()}>
                {/* Download button — direct proxy */}
                {item.driveFileId ? (
                  <>
                    <a
                      href={vanBanAPI.viewUrl(item._id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tk-btn-icon view"
                      title="Xem file trên web"
                      style={{ color: '#1976d2' }}
                    >
                      <FaEye />
                    </a>
                    <a
                      href={vanBanAPI.downloadUrl(item._id)}
                      download={item.driveFileName || true}
                      className="tk-btn-icon download"
                      title="Tải file về máy"
                    >
                      <FaDownload />
                    </a>
                  </>
                ) : isAdmin && (
                  <button
                    className="tk-btn-icon"
                    title="Chưa có file đính kèm — Bấm Sửa để thêm file"
                    style={{ color: '#ccc', cursor: 'default' }}
                  >
                    <FaPaperclip />
                  </button>
                )}
                {/* Edit */}
                {isEditable && (
                  <button
                    className="tk-btn-icon edit"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(item)}
                  >
                    <FaEdit />
                  </button>
                )}
                {/* Delete — admin only */}
                {isAdmin && (
                  <button
                    className="tk-btn-icon delete"
                    title="Xóa"
                    onClick={() => onDelete(item._id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            {/* Badges */}
            <div>
              <span className={`tk-item-loai-badge ${item.loai === 'Thành ủy' ? 'thanh-uy' : 'dang-uy'}`}>
                {item.loai}
              </span>
              {' '}
              <span className="tk-item-type-badge">{item.loaiVanBan}</span>
            </div>

            {/* Date */}
            <div className="tk-item-date">{formatDate(item.ngayVanBan)}</div>

            {/* Trich yeu preview */}
            {item.trichYeu && (
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.trichYeu}
              </div>
            )}

            {/* File indicator */}
            {item.driveFileId && (
              <div style={{ fontSize: '0.68rem', color: '#1976d2', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                📎 {item.driveFileName || 'Có file đính kèm'}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default VanBanList;
