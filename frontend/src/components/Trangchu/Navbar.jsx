import { FaHome, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="tdt-search-bar" style={{ justifyContent: 'space-between' }}>
      {/* Left: Home icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" className="tdt-home-btn" title="Trang chủ">
          <FaHome />
        </a>
      </div>

      {/* Right: Login/User */}
      <div className="tdt-nav-actions">
        {user ? (
          <div className="tdt-user-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

              {user.role === 'admin' && (
                <span style={{ fontSize: '0.72rem', background: '#c1272d', color: '#fff', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontWeight: 700 }}>ADMIN</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

              <button className="tdt-logout-btn" onClick={logout} style={{
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
          </div>
        ) : (
          <a href="/login" className="tdt-login-btn">
            <FaUser style={{ fontSize: '12px' }} /> Đăng nhập
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;