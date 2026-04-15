import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Đăng Nhập</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f3f4f6;
          background-image: 
            radial-gradient(at 0% 0%, rgba(185, 28, 28, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(251, 191, 36, 0.08) 0px, transparent 50%);
          font-family: 'Inter', sans-serif;
        }

        .login-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-top: 5px solid #b91c1c;
          padding: 3rem;
          border-radius: 12px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-header h1 {
          color: #b91c1c;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }

        .login-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          color: #b91c1c;
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.95rem;
          text-align: center;
          font-weight: 500;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #374151;
          font-size: 0.95rem;
          font-weight: 600;
          margin-left: 0.2rem;
        }

        .form-group input {
          background: #f9fafb;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.85rem 1rem;
          color: #1f2937;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #fbbf24;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.15);
        }

        .login-button {
          background: #b91c1c;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .login-button:hover:not(:disabled) {
          background: #991b1b;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(185, 28, 28, 0.3);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
