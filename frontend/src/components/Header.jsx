import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-container">
          <div className="header-brand">
            <img
              src="/img/CoDang.jpg"
              alt="Logo Đảng bộ"
              className="logo-img"
            />
            <div className="brand-text">
              <h1>ĐẢNG ỦY XÃ BÀ ĐIỂM</h1>
              <h2>THEO DÕI NGHỊ QUYẾT ĐẢNG BỘ LẦN THỨ I, NHIỆM KỲ 2025 - 2030</h2>
            </div>
          </div>
          
          {user && (
            <div className="user-profile">
              <span className="user-name">Chào, <strong>{user.username}</strong></span>
              <button onClick={logout} className="logout-button">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="header-bottom">
        <div className="header-container flex-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm chỉ tiêu, văn bản..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <span className="filter-label">Danh mục:</span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="category-select"
            >
              <option value="">Tất cả lĩnh vực</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;