import React, { useState } from 'react';
import { setAccessToken, apiFetch } from '../../api';
import '../../style.css';


const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12c0 0 3.5-7 10-7s10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeCrossed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12c0 0 3.5-7 10-7s10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    <line x1="3" y1="3" x2="21" y2="21" />
  </svg>
);

const LoginForm = ({ onLoginSuccess }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [isFirstLoginMode, setIsFirstLoginMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      //обычный fetch, т.к. токена еще нет
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      if (response.status === 403) {
        const data = await response.json();
        if (data.isFirstLogin) {
          setAccessToken(data.tempToken);
          setIsFirstLoginMode(true);
        }
      } else if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        onLoginSuccess(data.user);
      } else {
        const errorData = await response.json();
        setAuthError(errorData.error || 'Неверный логин или пароль');
      }
    } catch (error) {
      setAuthError('Ошибка соединения с сервером');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await apiFetch('/auth/password-setup', {
        method: 'PUT',
        body: JSON.stringify({ newPassword })
      });

      if (response.ok) {
        const data = await response.json();

        setAccessToken(data.accessToken);

        onLoginSuccess(data.user);
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error || 'Не удалось обновить пароль'}`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка соединения с сервером');
    }
  };

  if (isFirstLoginMode) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', background: '#0f172a', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '350px' }}>
          <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '10px' }}>Добро пожаловать!</h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '14px', marginBottom: '20px' }}>В целях безопасности установите свой постоянный пароль.</p>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Новый пароль"
                  className="form-control"
                  style={{ width: '100%', margin: 0, paddingRight: '40px' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    background: '#fff'
                  }}
                >
                  {showNewPassword ? <IconEye /> : <IconEyeCrossed />}
                </span>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Сохранить и войти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', background: '#0f172a', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '350px' }}>
        <h2 style={{ color: '#fff', textAlign: 'center' }}>СТО Система</h2>
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label style={{ color: '#cbd5e1' }}>Логин</label>
            <input
              type="text"
              className="form-control"
              style={{ width: '100%', marginBottom: '15px' }}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ color: '#cbd5e1', marginBottom: '5px', display: 'block' }}>Пароль</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showMainPassword ? 'text' : 'password'}
                className="form-control"
                style={{
                  width: '100%',
                  margin: 0,
                  paddingRight: '40px'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowMainPassword(!showMainPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  background: '#fff',
                }}
              >
                {showMainPassword ? <IconEye /> : <IconEyeCrossed />}
              </span>
            </div>
          </div>
          {authError && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>{authError}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Войти</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;