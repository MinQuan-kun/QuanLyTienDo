import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaSignOutAlt, FaSortAlphaDown, FaSortAlphaUp, FaSort } from 'react-icons/fa';
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
  const [sortOrder, setSortOrder] = useState('none'); // 'none' | 'asc' | 'desc'

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

  // Natural sort helper: splits string into text/number segments for proper ordering
  const naturalSort = (a, b) => {
    const ax = (a.soKyHieu || '').split(/(\d+)/);
    const bx = (b.soKyHieu || '').split(/(\d+)/);
    for (let i = 0; i < Math.max(ax.length, bx.length); i++) {
      const ai = ax[i] || '';
      const bi = bx[i] || '';
      const an = parseInt(ai, 10);
      const bn = parseInt(bi, 10);
      if (!isNaN(an) && !isNaN(bn)) {
        if (an !== bn) return an - bn;
      } else {
        const cmp = ai.localeCompare(bi, 'vi');
        if (cmp !== 0) return cmp;
      }
    }
    return 0;
  };

  // Items for table: filtered by tab + search + sorted
  const tableItems = useMemo(() => {
    let result = filterLoai === 'Tất cả' ? filteredItems : filteredItems.filter(v => v.loai === filterLoai);
    if (sortOrder === 'asc') {
      result = [...result].sort(naturalSort);
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => naturalSort(b, a));
    }
    return result;
  }, [filteredItems, filterLoai, sortOrder]);

  const cycleSortOrder = () => {
    setSortOrder(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none');
  };

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

        {/* Sort toggle */}
        <button
          className={`tk-sort-btn ${sortOrder !== 'none' ? 'active' : ''}`}
          onClick={cycleSortOrder}
          title={sortOrder === 'none' ? 'Sắp xếp theo ký hiệu' : sortOrder === 'asc' ? 'Đang sắp xếp A → Z' : 'Đang sắp xếp Z → A'}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 12px', border: sortOrder !== 'none' ? '2px solid #c1272d' : '1px solid #ccc',
            borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
            background: sortOrder !== 'none' ? '#fff5f5' : '#fff',
            color: sortOrder !== 'none' ? '#c1272d' : '#555',
            transition: 'all 0.2s'
          }}
        >
          {sortOrder === 'asc' ? <FaSortAlphaDown /> : sortOrder === 'desc' ? <FaSortAlphaUp /> : <FaSort />}
          {sortOrder === 'none' ? 'Sắp xếp' : sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
        </button>

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
