import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import TrangchuPage from './pages/TrangchuPage';
import LoginPage from './pages/LoginPage';
import TheodoitiendoPage from './pages/TheodoitiendoPage';
import TimkiemPage from './pages/TimkiemPage';
import AccountManagementPage from './pages/AccountManagementPage';
import TheodoitiendotrienkhaiPage from './pages/TheodoitiendotrienkhaiPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
          <Routes>
            <Route path="/" element={<TrangchuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/tim-kiem" element={<TimkiemPage />} />
            <Route path="/theo-doi-tien-do" element={<TheodoitiendoPage />} />
            <Route path="/theo-doi-tien-do-trien-khai" element={<TheodoitiendotrienkhaiPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/users" element={<AccountManagementPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;