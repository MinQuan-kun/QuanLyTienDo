import { FaHome } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="trangchu-navbar">
      <div className="navbar-container">
        
        {/* Nhóm bên trái: Home và Tìm kiếm */}
        <div className="nav-group-left">
          <a href="/" className="nav-item home-icon">
            <FaHome />
          </a>
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