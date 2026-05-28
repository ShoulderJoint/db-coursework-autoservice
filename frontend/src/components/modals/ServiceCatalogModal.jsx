import React, { useState, useEffect } from 'react';

const ServiceCatalogModal = ({ isOpen, onClose, onRefresh, serviceToEdit }) => {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', estimated_time_minutes: '' });

  useEffect(() => {
    if (isOpen) {
      if (serviceToEdit) {
        setFormData({ 
          name: serviceToEdit.name || '', 
          price: serviceToEdit.price || '',
          description: serviceToEdit.description || '',
          estimated_time_minutes: serviceToEdit.estimated_time_minutes || ''
        });
      } else {
        setFormData({ name: '', price: '', description: '', estimated_time_minutes: '' });
      }
    }
  }, [isOpen, serviceToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = serviceToEdit ? `http://localhost:3000/catalog/${serviceToEdit.id}` : 'http://localhost:3000/catalog';
    const method = serviceToEdit ? 'PUT' : 'POST';

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
      alert('Ошибка при сохранении услуги');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '400px' }}>
        <h2>{serviceToEdit ? 'Редактировать услугу' : 'Добавить услугу в каталог'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input type="text" placeholder="Наименование услуги" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ padding: '8px' }} />
          
          <textarea placeholder="Подробное описание услуги" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ padding: '8px', resize: 'vertical' }} />
          
          <input type="number" placeholder="Примерное время выполнения (в минутах)" min="1" required value={formData.estimated_time_minutes} onChange={(e) => setFormData({...formData, estimated_time_minutes: e.target.value})} style={{ padding: '8px' }} />
          
          <input type="number" placeholder="Базовая стоимость (руб.)" min="0" step="50" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ padding: '8px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceCatalogModal;