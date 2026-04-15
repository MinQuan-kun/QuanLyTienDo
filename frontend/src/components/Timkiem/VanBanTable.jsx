import React from 'react';
import { FaTable, FaDownload, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { vanBanAPI } from '../../api/api';

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN');
};

const VanBanTable = ({ items, isEditable, isAdmin, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="tk-placeholder">
        <div className="tk-placeholder-icon">📄</div>
        <div className="tk-placeholder-text">Chọn văn bản ở danh sách bên trái để xem chi tiết</div>
      </div>
    );
  }

  return (
    <div className="tk-table-wrapper">
      <div className="tk-table-header">
        <h3 className="tk-table-title">
          <FaTable className="tk-table-title-icon" />
          Danh sách văn bản ({items.length})
        </h3>
      </div>

      <div className="tk-table-scroll">
        <table className="tk-table">
          <thead>
            <tr>
              <th className="col-stt">STT</th>
              <th className="col-so">Số, ký hiệu</th>
              <th className="col-ngay">Ngày, tháng</th>
              <th className="col-loai">Tên loại & Trích yếu nội dung</th>
              <th className="col-nguoiky">Người ký</th>
              <th className="col-noinhanhot">Nơi nhận</th>
              <th className="col-dvbanluu">Đơn vị nhận bản lưu</th>
              <th className="col-soluong">Số lượng bản</th>
              <th className="col-ghi">Ghi chú</th>
              <th style={{ width: 100 }}>Tải về / Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item._id}>
                <td className="col-stt">{idx + 1}</td>
                <td className="col-so">
                  <div>{item.soKyHieu}</div>
                  <span className={`tk-item-loai-badge ${item.loai === 'Thành ủy' ? 'thanh-uy' : 'dang-uy'}`} style={{ marginTop: 4 }}>
                    {item.loai}
                  </span>
                </td>
                <td className="col-ngay">{formatDate(item.ngayVanBan)}</td>
                <td className="col-loai">
                  <span className="tk-table-type-badge">{item.loaiVanBan}</span>
                  {item.trichYeu && (
                    <div className="tk-table-trichyeu">{item.trichYeu}</div>
                  )}
                </td>
                <td className="col-nguoiky">{item.nguoiKy || '—'}</td>
                <td className="col-noinhanhot">{item.noiNhan || '—'}</td>
                <td className="col-dvbanluu">{item.donViNhanBanLuu || '—'}</td>
                <td className="col-soluong">{item.soLuongBan ?? '—'}</td>
                <td className="col-ghi">{item.ghiChu || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Download — Luôn hiện cho tất cả mọi người nếu có file */}
                    {item.driveFileId ? (
                      <>
                        <a
                          href={vanBanAPI.viewUrl(item._id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tk-btn-icon view"
                          title={`Xem trên web: ${item.driveFileName || 'file'}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1976d2' }}
                        >
                          <FaEye />
                        </a>
                        <a
                          href={vanBanAPI.downloadUrl(item._id)}
                          download={item.driveFileName || true}
                          className="tk-btn-icon download"
                          title={`Tải về: ${item.driveFileName || 'file'}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <FaDownload />
                        </a>
                      </>
                    ) : (
                       <span title="Không có file đính kèm" style={{ color: '#ccc', fontSize: '11px' }}>—</span>
                    )}

                    {/* Sửa/Xóa — Chỉ hiện cho user có quyền */}
                    {isEditable && (
                      <button
                        className="tk-btn-icon edit"
                        title="Chỉnh sửa"
                        onClick={() => onEdit(item)}
                      >
                        <FaEdit />
                      </button>
                    )}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VanBanTable;
