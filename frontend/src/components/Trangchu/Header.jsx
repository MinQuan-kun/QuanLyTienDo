import React from 'react';

const Header = ({ backgroundImage = "/img/" }) => {
    const headerStyle = backgroundImage
        ? { backgroundImage: `url(${backgroundImage})` }
        : {};

    return (
        <header className="Trangchu-header" style={headerStyle}>
            <div className="trangchu-header-top">
                <div className="trangchu-header-container">
                    <div className="trangchu-header-brand">
                        <img
                            src="/img/Logo.jpg"
                            alt="Logo Đảng bộ"
                            className="trangchu-logo-img"
                        />
                        <div className="brand-text">
                            <h1>VĂN PHÒNG ĐẢNG ỦY XÃ BÀ ĐIỂM</h1>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;