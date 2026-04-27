import React, { useMemo } from 'react';
import { FaPaperclip, FaDownload, FaEye } from 'react-icons/fa';
import { tienDoTrienKhaiAPI } from '../../api/api';

const MainTable = ({ treeData }) => {

    const rows = useMemo(() => {
        const result = [];
        let stt = 1;

        treeData.forEach(tu => {
            const childrenList = tu.children || [];
            let tuRowSpan = 0;
            const tuRows = [];

            if (childrenList.length === 0) {
                tuRowSpan = 1;
                tuRows.push({
                    tu, tuIsFirst: true, tuRowSpan: 1,
                    thu: null, thuIsFirst: true, thuRowSpan: 1,
                    du: null
                });
            } else {
                childrenList.forEach(child => {
                    if (child.treeType === 'dang-uy') {
                        tuRowSpan += 1;
                        tuRows.push({
                            tu, tuIsFirst: false, tuRowSpan: 0,
                            thu: null, thuIsFirst: true, thuRowSpan: 1,
                            du: child
                        });
                    } else {
                        const thu = child;
                        const duList = thu.children || [];
                        let thuRowSpan = 0;
                        const thuRows = [];

                        if (duList.length === 0) {
                            thuRowSpan = 1;
                            thuRows.push({
                                tu, tuIsFirst: false, tuRowSpan: 0,
                                thu, thuIsFirst: true, thuRowSpan: 1,
                                du: null
                            });
                        } else {
                            thuRowSpan = duList.length;
                            duList.forEach((du, idx) => {
                                thuRows.push({
                                    tu, tuIsFirst: false, tuRowSpan: 0,
                                    thu, thuIsFirst: idx === 0, thuRowSpan: thuRowSpan,
                                    du
                                });
                            });
                        }

                        tuRowSpan += thuRowSpan;
                        tuRows.push(...thuRows);
                    }
                });
            }

            // Update the first row of TU
            if (tuRows.length > 0) {
                tuRows[0].tuIsFirst = true;
                tuRows[0].tuRowSpan = tuRowSpan;
                tuRows[0].stt = stt++;
            }

            result.push(...tuRows);
        });

        return result;
    }, [treeData]);

    const renderCellContent = (node, type) => {
        if (!node) return null;
        return (
            <div className="tdttk-cell-content">
                <div className="tdttk-doc-title" style={{ fontWeight: 600, color: '#1e293b' }}>
                    {node.soKyHieu || node.tenVanBan}
                </div>
                {node.trichYeu && <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>{node.trichYeu}</div>}
                {node.ngayVanBan && (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        Ngày: {new Date(node.ngayVanBan).toLocaleDateString('vi-VN')}
                    </div>
                )}
                {node.ghiChu && <div className="tdttk-doc-note" style={{ marginTop: '4px' }}>Ghi chú: {node.ghiChu}</div>}
                {node.driveFileId && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                        <a href={tienDoTrienKhaiAPI.viewUrl(type, node._id)} target="_blank" rel="noreferrer" className="tdttk-file-link" title={`Xem: ${node.driveFileName || 'file'}`}>
                            <FaEye /> Xem
                        </a>
                        <a href={tienDoTrienKhaiAPI.downloadUrl(type, node._id)} download={node.driveFileName || true} className="tdttk-file-link" title={`Tải: ${node.driveFileName || 'file'}`} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                            <FaDownload /> Tải
                        </a>
                    </div>
                )}
            </div>
        );
    };

    const renderKetQuaList = (duNode, loai) => {
        if (!duNode || !duNode.children) return null;
        const items = duNode.children.filter(child => child.loai === loai);
        if (items.length === 0) return <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>-</span>;

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((item, idx) => (
                    <div key={item._id} className="tdttk-list-item">
                        <div style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                            {item.soKyHieu}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>{item.trichYeu}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                            Ngày: {new Date(item.ngayVanBan).toLocaleDateString('vi-VN')}
                        </div>
                        {item.ghiChu && <div className="tdttk-doc-note" style={{ marginLeft: '12px' }}>Ghi chú: {item.ghiChu}</div>}
                        {item.driveFileId && (
                            <div style={{ display: 'flex', gap: '6px', marginLeft: '12px', marginTop: '4px' }}>
                                <a href={tienDoTrienKhaiAPI.viewUrl('ket-qua', item._id)} target="_blank" rel="noreferrer" className="tdttk-file-link" title={`Xem: ${item.driveFileName}`}>
                                    <FaEye /> Xem
                                </a>
                                <a href={tienDoTrienKhaiAPI.downloadUrl('ket-qua', item._id)} download={item.driveFileName || true} className="tdttk-file-link" title={`Tải: ${item.driveFileName}`} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                                    <FaDownload /> Tải
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="tdttk-table-container">
            <table className="tdttk-table">
                <thead>
                    <tr>
                        <th rowSpan="2" style={{ width: '40px' }}>STT</th>
                        <th rowSpan="2" style={{ width: '22%' }}>Văn bản Trung ương</th>
                        <th rowSpan="2" style={{ width: '22%' }}>Văn bản Thành ủy</th>
                        <th colSpan="3" style={{ textAlign: 'center' }}>Văn bản Đảng ủy</th>
                    </tr>
                    <tr>
                        <th style={{ width: '18%' }}>Đã thực hiện</th>
                        <th style={{ width: '18%' }}>Đang triển khai</th>
                        <th style={{ width: '20%' }}>Ghi chú chung</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                Chưa có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, idx) => (
                            <tr key={idx}>
                                {row.tuIsFirst && <td rowSpan={row.tuRowSpan} style={{ textAlign: 'center', fontWeight: 'bold' }}>{row.stt}</td>}
                                {row.tuIsFirst && <td rowSpan={row.tuRowSpan}>{renderCellContent(row.tu, 'trung-uong')}</td>}

                                {row.thuIsFirst && <td rowSpan={row.thuRowSpan}>{renderCellContent(row.thu, 'thanh-uy')}</td>}

                                <td style={{ verticalAlign: 'top' }}>{renderKetQuaList(row.du, 'Đã thực hiện')}</td>
                                <td style={{ verticalAlign: 'top' }}>{renderKetQuaList(row.du, 'Đang triển khai')}</td>
                                <td style={{ verticalAlign: 'top' }}>
                                    {row.du && row.du.ghiChu && <div className="tdttk-doc-note" style={{ marginBottom: '8px' }}>{row.du.ghiChu}</div>}
                                    {renderKetQuaList(row.du, 'Ghi chú')}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MainTable;
