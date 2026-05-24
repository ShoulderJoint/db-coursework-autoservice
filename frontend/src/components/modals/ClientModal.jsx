import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../api';

const ClientModal = ({ isOpen, onClose, clientToEdit, onRefresh }) => {
  const [formData, setFormData] = useState({
    surname: '', name: '', patronymic: '', phone: '', email: ''
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        surname: clientToEdit.surname || '',
        name: clientToEdit.name || '',
        patronymic: clientToEdit.patronymic || '',
        phone: clientToEdit.phone || '',
        email: clientToEdit.email || ''
      });
    } else {
      setFormData({ surname: '', name: '', patronymic: '', phone: '', email: '' });
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = clientToEdit ? `/clients/${clientToEdit.id}` : '/clients';
    const method = clientToEdit ? 'PUT' : 'POST';

    try {
      const response = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onRefresh(); 
        onClose();   
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error || err.message}`);
      }
    } catch (error) {
      alert('Ошибка при сохранении данных');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h2>{clientToEdit ? 'Редактировать клиента' : 'Новый клиент'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" placeholder="Фамилия" required
            value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} 
          />
          <input 
            type="text" placeholder="Имя" required
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <input 
            type="text" placeholder="Отчество" 
            value={formData.patronymic} onChange={(e) => setFormData({...formData, patronymic: e.target.value})} 
          />
          <input 
            type="text" placeholder="Телефон (+7...)" required
            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          />
          <input 
            type="text" placeholder="Почта (alex99@example.ru)" required
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;