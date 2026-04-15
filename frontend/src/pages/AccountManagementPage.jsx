import React, { useState, useEffect } from 'react';
import { userAPI } from '../api/api';
import AccountHeader from '../components/AccountManagement/Header';
import Navbar from '../components/Trangchu/Navbar';
import UserTable from '../components/AccountManagement/UserTable';
import UserModal from '../components/AccountManagement/UserModal';
import '../styles/trangchu.css';
import '../styles/thedoitiendo.css';
import '../styles/user.css';

const AccountManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newUserData, setNewUserData] = useState({ username: '', password: '', role: 'user' });
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = (users || []).filter(u => 
        (u.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll();
            const fetchedUsers = response.data?.data?.users || response.data?.users || [];
            setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
        try {
            await userAPI.delete(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert('Lỗi khi xóa tài khoản: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await userAPI.create(newUserData);
            setShowModal(false);
            setNewUserData({ username: '', password: '', role: 'user' });
            fetchUsers();
        } catch (err) {
            alert('Lỗi khi tạo tài khoản: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <AccountHeader />
            <Navbar />
            
            <main className="management-container">
                <div className="management-header">
                    <h2>QUẢN LÝ TÀI KHOẢN</h2>
                    <button className="add-btn" onClick={() => setShowModal(true)}>
                        <span>+</span> THÊM TÀI KHOẢN
                    </button>
                </div>

                {loading ? (
                    <div className="admin-loader-container">
                        <div className="admin-spinner"></div>
                        <p>Đang tải dữ liệu hệ thống...</p>
                    </div>
                ) : error ? (
                    <div className="admin-error-card">
                        <div className="error-icon">⚠️</div>
                        <p>{error}</p>
                        <button onClick={fetchUsers}>Thử lại</button>
                    </div>
                ) : (
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="header-info">
                                <h3>DANH SÁCH NGƯỜI DÙNG</h3>
                                <p>Tổng số: {users.length} tài khoản</p>
                            </div>
                            <div className="header-actions">
                                <div className="admin-search-box">
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm tài khoản..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <UserTable 
                            users={filteredUsers} 
                            onDelete={handleDelete} 
                        />
                    </div>
                )}
            </main>

            <UserModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreateUser}
                newUserData={newUserData}
                setNewUserData={setNewUserData}
                submitting={submitting}
            />
        </>
    );
};

export default AccountManagementPage;
