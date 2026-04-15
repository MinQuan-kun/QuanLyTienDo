import { FaSearch, FaUser, FaSignOutAlt, FaHome, FaSync } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SearchFilterBar = ({ onSearch, onFilterCategory, currentFilter, onRefresh, onCreateNew }) => {
  const [searchValue, setSearchValue] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) onSearch(value);
  };

  const handleClear = () => {
    setSearchValue('');
    if (onSearch) onSearch('');
  };

  const handleLogout = () => {
    logout();
  };

  const categories = [
    { value: 'All', label: 'Tất cả lĩnh vực' },
    { value: 'Kinh tế', label: 'Kinh tế' },
    { value: 'Xã hội', label: 'Văn hóa - Xã hội' },
    { value: 'Môi trường', label: 'Môi trường' },
    { value: 'Giáo dục', label: 'Giáo dục' },
    { value: 'Y tế', label: 'Y tế' },
    { value: 'Khác', label: 'Khác' },
  ];

  return (
    <div className="tdt-search-bar">
      {/* Home Button */}
      <a href="/" className="tdt-home-btn" title="Trang chủ">
        <FaHome />
      </a>

      {/* Refresh Button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="tdt-home-btn"
          title="Làm mới dữ liệu"
          style={{ background: '#f5f5f5', color: '#555', marginLeft: '-5px', marginRight: '5px' }}
        >
          <FaSync />
        </button>
      )}

      {/* Search Box & Actions */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="tdt-search-box" style={{ width: '100%', flex: 'none' }}>
          <FaSearch className="tdt-search-icon" />
          <input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            className="tdt-search-input"
            placeholder="Tìm kiếm chỉ tiêu, văn bản..."
          />
          {searchValue && (
            <button className="tdt-search-clear" onClick={handleClear}>✕</button>
          )}
        </div>

        {/* Nút Tạo Nội dung mới */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="tdt-login-btn"
              style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#4caf50', borderColor: '#4caf50' }}
            >
              + Tạo theo dõi mới
            </button>
          )}
        </div>
      </div>

      {/* Login/User Actions */}
      <div className="tdt-nav-actions">
        {user ? (
          <div className="tdt-user-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {user.role === 'admin' && (
                <span style={{ fontSize: '0.72rem', background: '#c1272d', color: '#fff', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontWeight: 700 }}>ADMIN</span>
              )}
            </div>

            <button className="tdt-logout-btn" onClick={handleLogout} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 14px',
              background: '#ffca28',
              color: '#c1272d',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              transition: 'all 0.2s'
            }}>
              <FaSignOutAlt style={{ fontSize: '12px' }} /> Đăng xuất
            </button>
          </div>
        ) : (
          <a href="/login" className="tdt-login-btn">
            <FaUser style={{ fontSize: '12px' }} /> Đăng nhập
          </a>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;