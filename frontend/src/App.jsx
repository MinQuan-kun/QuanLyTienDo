import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProgressTracker from './components/Theodoitiendo/ProgressTracker';
import LoginPage from './pages/LoginPage';
import TrangchuPage from './pages/TrangchuPage';
import TheodoitiendoPage from './pages/TheodoitiendoPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <div className="app-content">
            <Routes>
              <Route path="/" element={<TrangchuPage />} />
              <Route path="/theodoitiendo" element={<TheodoitiendoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <ProgressTracker />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

