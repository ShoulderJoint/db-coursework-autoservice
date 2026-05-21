import React, { useState, useEffect } from 'react';

const StaffModal = ({ isOpen, onClose, onRefresh, staffToEdit, meta }) => {
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
      if (staffToEdit) {
        setFormData({
          surname: staffToEdit.surname || '',
          name: staffToEdit.name || '',
          patronymic: staffToEdit.patronymic || '',
          login: staffToEdit.login || '',
          password: '', // Пароль при редактировании не показываем
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
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = staffToEdit 
      ? `http://localhost:3000/staff/${staffToEdit.id}` 
      : 'http://localhost:3000/staff';
    const method = staffToEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>{staffToEdit ? 'Редактировать сотрудника' : 'Новый сотрудник'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Фамилия" required style={{ flex: 1, padding: '8px' }} />
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Имя" required style={{ flex: 1, padding: '8px' }} />
          </div>
          <input name="patronymic" value={formData.patronymic} onChange={handleChange} placeholder="Отчество" style={{ padding: '8px' }} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <input name="login" value={formData.login} onChange={handleChange} placeholder="Логин для входа" required style={{ flex: 1, padding: '8px' }} />
            {!staffToEdit && (
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Пароль" required style={{ flex: 1, padding: '8px' }} />
            )}
          </div>

          <select name="station_id" value={formData.station_id} onChange={handleChange} required style={{ padding: '8px' }}>
            <option value="">-- Выберите филиал --</option>
            {meta.stations.map(st => <option key={st.id} value={st.id}>{st.city},{st.street}, {st.house}</option>)}
          </select>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select name="role_id" value={formData.role_id} onChange={handleChange} required style={{ flex: 1, padding: '8px' }}>
              <option value="">-- Должность --</option>
              {meta.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            <select name="system_role_id" value={formData.system_role_id} onChange={handleChange} required style={{ flex: 1, padding: '8px' }}>
              <option value="">-- Системная роль --</option>
              {meta.systemRoles.map(sr => <option key={sr.id} value={sr.id}>{sr.display_name}</option>)}
            </select>
          </div>

          {/* Переключатель статуса показываем только при редактировании */}
          {staffToEdit && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px', padding: '10px', background: formData.is_active ? '#ecfdf5' : '#fef2f2', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              <strong style={{ color: formData.is_active ? '#059669' : '#dc2626' }}>
                {formData.is_active ? 'Сотрудник активен (имеет доступ в систему)' : 'Сотрудник отключен (доступ закрыт)'}
              </strong>
            </label>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;