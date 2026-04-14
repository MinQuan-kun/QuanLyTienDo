import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import TrangchuPage from './pages/TrangchuPage';
import LoginPage from './pages/LoginPage';
import TheodoitiendoPage from './pages/TheodoitiendoPage';
// import TracuuPage from './pages/TracuuPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Container chính: Đảm bảo không bị tràn màn hình (viewport) */}
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
          <Routes>
            <Route path="/" element={<TrangchuPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/tracuu" element={<TracuuPage />} /> */}
            {/* Trang theo dõi tiến độ: 
                Lưu ý: Không bọc ProtectedRoute nếu muốn cho khách xem */}
            <Route path="/theodoitiendo" element={<TheodoitiendoPage />} />
            
            {/* Các route yêu cầu đăng nhập mới được vào */}
            
            <Route element={<ProtectedRoute />}>
              {/* Thêm các trang admin/private ở đây nếu có */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;