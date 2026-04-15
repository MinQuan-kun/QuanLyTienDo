import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaSignOutAlt } from 'react-icons/fa';
import VanBanList from '../components/Timkiem/VanBanList';
import VanBanTable from '../components/Timkiem/VanBanTable';
import VanBanFormModal from '../components/Timkiem/VanBanFormModal';
import { vanBanAPI } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/thedoitiendo.css';
import '../styles/timkiem.css';

const TimkiemPage = () => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filterLoai, setFilterLoai] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, logout } = useAuth();
  const isEditable = !!user;
  const isAdmin = user?.role === 'admin';

  // Fetch
  const fetchItems = async () => {
    try {
      const res = await vanBanAPI.getAll();
      setItems(res.data.data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách văn bản:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Client-side search filter
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const q = searchTerm.toLowerCase();
    return items.filter(v =>
      v.soKyHieu?.toLowerCase().includes(q) ||
      v.trichYeu?.toLowerCase().includes(q) ||
      v.nguoiKy?.toLowerCase().includes(q) ||
      v.noiNhan?.toLowerCase().includes(q) ||
      v.loaiVanBan?.toLowerCase().includes(q)
    );
  }, [items, searchTerm]);

  // Items for table: filtered by tab + search
  const tableItems = useMemo(() => {
    if (filterLoai === 'Tất cả') return filteredItems;
    return filteredItems.filter(v => v.loai === filterLoai);
  }, [filteredItems, filterLoai]);

  // Handlers
  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa văn bản này?')) return;
    try {
      await vanBanAPI.delete(id);
      if (selectedId === id) setSelectedId(null);
      fetchItems();
    } catch (err) {
      alert('Lỗi xóa: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await vanBanAPI.update(editingItem._id, formData);
      } else {
        await vanBanAPI.create(formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      alert('Lỗi lưu: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelect = (item) => {
    setSelectedId(prev => prev === item._id ? null : item._id);
  };

  return (
    <div className="tk-page">
      {/* Header */}
      <header className="tk-header">
        <img src="/img/Logo.jpg" alt="Logo Đảng bộ" className="tk-header-logo" />
        <div className="tk-header-text">
          <h3 className="tk-header-subtitle">TÌM KIẾM VĂN BẢN</h3>
          <h1 className="tk-header-title">VĂN PHÒNG ĐẢNG ỦY XÃ BÀ ĐIỂM</h1>
        </div>
      </header>

      {/* Toolbar */}
      <div className="tk-toolbar">
        <Link to="/" className="tk-home-btn" title="Trang chủ">
          <FaHome />
        </Link>

        {/* Search */}
        <div className="tk-search-box">
          <FaSearch className="tk-search-icon" />
          <input
            className="tk-search-input"
            type="text"
            placeholder="Tìm theo số ký hiệu, trích yếu, người ký..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="tk-search-clear" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        {/* User info / Login */}
        {user ? (
          <div className="tk-user-bar">
            {isAdmin && <span style={{ fontSize: '0.72rem', background: '#c1272d', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>ADMIN</span>}
            <button className="tk-logout-btn" onClick={logout}><FaSignOutAlt style={{ marginRight: 4 }} />Đăng xuất</button>
          </div>
        ) : (
          <Link to="/login" className="tk-btn-add" style={{ textDecoration: 'none' }}>
            Đăng nhập
          </Link>
        )}
      </div>

      {/* Main layout */}
      <div className="tk-main-layout">
        {/* Left: Document List */}
        <aside className="tk-col-left">
          <VanBanList
            items={filteredItems}
            selectedId={selectedId}
            onSelect={handleSelect}
            filterLoai={filterLoai}
            onFilterLoai={setFilterLoai}
            isEditable={isEditable}
            isAdmin={isAdmin}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </aside>

        {/* Right: Table */}
        <main className="tk-col-main">
          <VanBanTable
            items={tableItems}
            isEditable={isEditable}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>
      </div>

      {/* Modal */}
      <VanBanFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        initialData={editingItem}
        onSave={handleSave}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default TimkiemPage;
