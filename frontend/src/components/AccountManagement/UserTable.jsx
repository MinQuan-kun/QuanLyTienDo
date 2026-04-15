import React from 'react';

const UserTable = ({ users, onDelete }) => {
    return (
        <div className="admin-table-wrapper">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th style={{ width: '60px' }}>STT</th>
                        <th>Tên người dùng</th>
                        <th>Phân quyền</th>
                        <th>Ngày tạo</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? users.map((u, index) => (
                        <tr key={u._id}>
                            <td className="text-center">{index + 1}</td>
                            <td>
                                <div className="user-info-cell">
                                    <div className="user-avatar">{(u.username?.[0] || '?').toUpperCase()}</div>
                                    <span className="username-text">{u.username || 'N/A'}</span>
                                </div>
                            </td>
                            <td>
                                <span className={`admin-badge ${u.role}`}>
                                    {u.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                </span>
                            </td>
                            <td className="text-muted">
                                {new Date(u.createdAt).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </td>
                            <td className="text-center">
                                <button 
                                    className="admin-action-btn delete" 
                                    onClick={() => onDelete(u._id)}
                                    title="Xóa tài khoản"
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Không có dữ liệu người dùng</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
