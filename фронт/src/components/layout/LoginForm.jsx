import React, { useState } from 'react';
import { MOCK_ACCOUNTS, MOCK_ROLES, MOCK_STAFF, MOCK_CLIENTS } from '../../data/mockData'; // Путь к данным
import '../../style.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [authError, setAuthError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 1. Находим сам аккаунт (логин/пароль)
    const account = MOCK_ACCOUNTS.find(
      (a) => a.login === loginData.login && a.password === loginData.password
    );

    if (account) {
      // 2. Находим название его роли (для работы кнопок в меню)
      const roleObj = MOCK_ROLES.find(r => r.id === account.role_id);
      const systemRole = roleObj ? roleObj.system_name : 'client';

      // 3. Ищем данные о человеке (ФИО) в зависимости от того, кто вошел
      let person = null;
      if (account.staff_id) {
        person = MOCK_STAFF.find(s => s.id === account.staff_id);
      } else if (account.client_id) {
        person = MOCK_CLIENTS.find(c => c.id === account.client_id);
      }

      // 4. Формируем "сборный" объект пользователя для всего приложения
      const userSession = {
        ...account,           // берем id аккаунта, login
        role: systemRole,     // добавляем строковую роль (admin, root и т.д.)
        name: person ? `${person.surname} ${person.name}` : 'Пользователь', // ФИО
        personId: account.staff_id || account.client_id // ID самого человека
      };

      onLoginSuccess(userSession); // Передаем этот собранный объект в App.jsx
    }
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', width: '100vw', background: '#0f172a', position: 'fixed', top: 0, left: 0, zIndex: 9999
    }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '350px' }}>
        <h2 style={{ color: '#fff', textAlign: 'center' }}>СТО Система</h2>
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label style={{ color: '#cbd5e1' }}>Логин</label>
            <input
              type="text"
              className="form-control"
              style={{ width: '100%', marginBottom: '15px' }}
              value={loginData.login}
              onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label style={{ color: '#cbd5e1' }}>Пароль</label>
            <input
              type="password"
              className="form-control"
              style={{ width: '100%', marginBottom: '15px' }}
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
          </div>
          {authError && <p style={{ color: '#ef4444', fontSize: '13px' }}>{authError}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Войти</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;