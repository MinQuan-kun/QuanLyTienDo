import { FaHome, FaSearch } from "react-icons/fa";
import { useState } from "react";

const Navbar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Nếu bạn muốn tìm kiếm ngay khi gõ:
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <nav className="trangchu-navbar">
      <div className="navbar-container">
        
        {/* Nhóm bên trái: Home và Tìm kiếm */}
        <div className="nav-group-left">
          <a href="/" className="nav-item home-icon">
            <FaHome />
          </a>

          {/* Khu vực Tìm kiếm */}
          <div className="nav-search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm văn bản..."
              value={searchValue}
              onChange={handleInputChange}
              className="nav-search-input"
            />
          </div>
        </div>

        {/* Nhóm bên phải: Đăng nhập */}
        <div className="nav-group-right">
          <a href="/login" className="nav-item login-btn">
            ĐĂNG NHẬP
          </a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;