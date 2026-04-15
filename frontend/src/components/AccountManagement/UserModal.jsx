import React from 'react';

const UserModal = ({ isOpen, onClose, onSubmit, newUserData, setNewUserData, submitting }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>THÊM TÀI KHOẢN MỚI</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={onSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input 
                            type="text" 
                            required 
                            className="modal-input"
                            value={newUserData.username}
                            onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
                            placeholder="Nhập tên đăng nhập..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input 
                            type="password" 
                            required 
                            className="modal-input"
                            value={newUserData.password}
                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Vai trò</label>
                        <select 
                            className="modal-input"
                            value={newUserData.role}
                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                        >
                            <option value="user">Người dùng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>HỦY</button>
                        <button type="submit" className="submit-btn" disabled={submitting}>
                            {submitting ? 'ĐANG TẠO...' : 'TẠO TÀI KHOẢN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
