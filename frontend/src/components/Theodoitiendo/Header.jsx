const Header = () => {
  return (
    <header className="tdt-header">
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '16px' }}>
        <img
          src="/img/Logo.jpg"
          alt="Logo Đảng bộ"
          className="tdt-header-logo"
        />
        <div className="tdt-header-text">
          <h3 className="tdt-header-subtitle">Theo dõi tiến độ</h3>
          <h1 className="tdt-header-title">VĂN PHÒNG ĐẢNG ỦY XÃ BÀ ĐIỂM</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;