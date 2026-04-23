import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronRight, FaPaperclip } from 'react-icons/fa';
import { tienDoTrienKhaiAPI } from '../../api/api';

const TreeNode = ({ node, type, isEditable, isAdmin, onAdd, onEdit, onDelete }) => {
    const [expanded, setExpanded] = useState(true);

    const typeConfig = {
        'trung-uong': { childType: 'thanh-uy', childLabel: 'VB Thành ủy', color: '#1e293b' },
        'thanh-uy': { childType: 'dang-uy', childLabel: 'VB Đảng ủy', color: '#334155' },
        'dang-uy': { childType: 'ket-qua', childLabel: 'Triển khai / Ghi chú', color: '#475569' },
        'ket-qua': { childType: null, childLabel: '', color: '#64748b' }
    };

    const config = typeConfig[type];

    const handleAdd = (e) => {
        e.stopPropagation();
        onAdd(config.childType, node._id);
        setExpanded(true);
    };

    return (
        <div className="tdttk-tree-node">
            <div
                className="tdttk-tree-node-content"
                onClick={() => setExpanded(!expanded)}
                style={{ borderLeft: `3px solid ${config.color}` }}
            >
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', width: '16px' }}>
                    {node.children && node.children.length > 0 && (
                        expanded ? <FaChevronDown /> : <FaChevronRight />
                    )}
                </div>

                <div className="tdttk-tree-node-text" title={node.soKyHieu || node.tenVanBan || node.noiDung}>
                    {type === 'ket-qua' ? (
                        <span><strong style={{ color: '#3b82f6' }}>[{node.loai}]</strong> {node.noiDung}</span>
                    ) : type === 'dang-uy' ? (
                        <span style={{ color: '#475569', fontStyle: 'italic' }}>Đảng ủy {node.ghiChu ? `- ${node.ghiChu}` : ''}</span>
                    ) : (
                        <span style={{ fontWeight: 600 }}>{node.soKyHieu || node.tenVanBan || '(Chưa có số)'}</span>
                    )}
                    {node.driveFileId && (
                        <a
                            href={tienDoTrienKhaiAPI.viewUrl(type, node._id)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ color: '#3b82f6', marginLeft: '6px', fontSize: '0.75rem' }}
                            title={`Xem file: ${node.driveFileName || ''}`}
                        >
                            <FaPaperclip />
                        </a>
                    )}
                </div>

                {isEditable && (
                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                        {type === 'trung-uong' ? (
                            <>
                                <button
                                    className="tdttk-btn-icon"
                                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px' }}
                                    onClick={(e) => { e.stopPropagation(); onAdd('thanh-uy', node._id, 'trung-uong'); setExpanded(true); }}
                                    title="Thêm VB Thành ủy"
                                >
                                    <FaPlus size={12} /> T.Ủy
                                </button>
                                <button
                                    className="tdttk-btn-icon"
                                    style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: '4px' }}
                                    onClick={(e) => { e.stopPropagation(); onAdd('dang-uy', node._id, 'trung-uong'); setExpanded(true); }}
                                    title="Thêm trực tiếp VB Đảng ủy"
                                >
                                    <FaPlus size={12} /> Đ.Ủy
                                </button>
                            </>
                        ) : config.childType && (
                            <button
                                className="tdttk-btn-icon"
                                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px' }}
                                onClick={(e) => { e.stopPropagation(); onAdd(config.childType, node._id, type); setExpanded(true); }}
                                title={`Thêm ${config.childLabel}`}
                            >
                                <FaPlus size={12} />
                            </button>
                        )}
                        <button
                            className="tdttk-btn-icon"
                            style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: '4px' }}
                            onClick={(e) => { e.stopPropagation(); onEdit(type, type === 'thanh-uy' ? node.trungUongId : type === 'dang-uy' ? (node.thanhUyId || node.trungUongId) : type === 'ket-qua' ? node.dangUyId : null, node); }}
                            title="Sửa"
                        >
                            <FaEdit size={12} />
                        </button>
                        {(isAdmin || isEditable) && (
                            <button
                                className="tdttk-btn-icon"
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                onClick={(e) => { e.stopPropagation(); onDelete(type, node._id); }}
                                title="Xóa"
                            >
                                <FaTrash size={12} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {expanded && node.children && node.children.length > 0 && (
                <div className="tdttk-tree-children">
                    {node.children.map(child => (
                        <TreeNode
                            key={child._id}
                            node={child}
                            type={child.treeType || config.childType}
                            isEditable={isEditable}
                            isAdmin={isAdmin}
                            onAdd={onAdd}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const TreeSidebar = ({ treeData, isEditable, isAdmin, onAdd, onEdit, onDelete }) => {
    return (
        <aside className="tdttk-sidebar">
            <div className="tdttk-sidebar-header">
                <h2 className="tdttk-sidebar-title">Danh mục</h2>
                {isEditable && (
                    <button className="tdttk-btn-add" onClick={() => onAdd('trung-uong')}>
                        <FaPlus size={10} /> Thêm Văn bản
                    </button>
                )}
            </div>

            <div className="tdttk-tree-container">
                {treeData.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                        Chưa có dữ liệu. Hãy thêm Văn bản Trung ương đầu tiên.
                    </div>
                ) : (
                    treeData.map(tu => (
                        <TreeNode
                            key={tu._id}
                            node={tu}
                            type="trung-uong"
                            isEditable={isEditable}
                            isAdmin={isAdmin}
                            onAdd={onAdd}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </aside>
    );
};

export default TreeSidebar;
