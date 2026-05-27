import React, { useState, useEffect } from 'react';

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

const StaffModal = ({ isOpen, onClose, onRefresh, staffToEdit, meta }) => {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    patronymic: '',
    login: '',
    password: '',
    station_id: '',
    role_id: '',
    system_role_id: '',
    is_active: true
  });

  useEffect(() => {
    if (isOpen) {
      setShowPassword(false);
      if (staffToEdit) {
        setFormData({
          surname: staffToEdit.surname || '',
          name: staffToEdit.name || '',
          patronymic: staffToEdit.patronymic || '',
          login: staffToEdit.login || '',
          password: '',
          station_id: staffToEdit.station_id || '',
          role_id: staffToEdit.role_id || '',
          system_role_id: staffToEdit.system_role_id || '',
          is_active: staffToEdit.is_active
        });
      } else {
        setFormData({
          surname: '', name: '', patronymic: '', login: '', password: '',
          station_id: '', role_id: '', system_role_id: '', is_active: true
        });
      }
    }
  }, [isOpen, staffToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updates = {
      [name]: type === 'checkbox' ? checked : value
    };

    // АВТОМАТИЗАЦИЯ: привязываем права доступа к должности
    if (name === 'role_id') {
      const roleId = parseInt(value, 10);
      if ([2, 3, 4].includes(roleId)) {
        updates.system_role_id = roleId;
      } else {
        updates.system_role_id = '';
        updates.login = '';
      }
    }

    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = staffToEdit
      ? `http://localhost:3000/staff/${staffToEdit.id}`
      : 'http://localhost:3000/staff';
    const method = staffToEdit ? 'PUT' : 'POST';

    // Формируем чистый payload (пустые строки превращаем в null для базы)
    const payload = {
      ...formData,
      system_role_id: formData.system_role_id === '' ? null : formData.system_role_id
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch (error) {
      alert('Ошибка при сохранении данных');
    }
  };

  if (!isOpen || !meta) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <h2 style={{ marginTop: 0 }}>{staffToEdit ? 'Редактировать сотрудника' : 'Новый сотрудник'}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Фамилия" required style={{ flex: 1, padding: '8px' }} />
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Имя" required style={{ flex: 1, padding: '8px' }} />
          </div>
          <input name="patronymic" value={formData.patronymic} onChange={handleChange} placeholder="Отчество" style={{ padding: '8px' }} />

          <select name="station_id" value={formData.station_id} onChange={handleChange} required style={{ padding: '8px' }}>
            <option value="">-- Выберите филиал --</option>
            {meta.stations.map(st => <option key={st.id} value={st.id}>{st.city}, {st.street}, {st.house}</option>)}
          </select>

          {/* Оставили только должность */}
          <select name="role_id" value={formData.role_id} onChange={handleChange} required style={{ padding: '8px' }}>
            <option value="">-- Должность --</option>
            {meta.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          {/* Если должность подразумевает работу в системе - показываем логин/пароль */}
          {formData.system_role_id !== '' && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <input name="login" value={formData.login} onChange={handleChange} placeholder="Логин для входа" required style={{ flex: 1, padding: '8px' }} />
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={staffToEdit ? "Новый пароль" : "Пароль"}
                  required={!staffToEdit}
                  style={{ width: '100%', padding: '8px', paddingRight: '35px', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <IconEyeCrossed /> : <IconEye />}
                </button>
              </div>
            </div>
          )}

          {staffToEdit && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px', background: formData.is_active ? '#ecfdf5' : '#fef2f2', border: '1px solid #e2e8f0', borderRadius: '4px', marginTop: '10px' }}>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              <strong style={{ color: formData.is_active ? '#059669' : '#dc2626', fontSize: '14px' }}>
                {formData.is_active ? 'Сотрудник активен' : 'Сотрудник отключен'}
              </strong>
            </label>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '5px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;