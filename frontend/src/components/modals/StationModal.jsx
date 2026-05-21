import React, { useState, useEffect } from 'react';

const StationModal = ({ isOpen, onClose, onRefresh, stationToEdit }) => {
  const [formData, setFormData] = useState({region: '', city: '', street: '', house: '', phone: '' });

  useEffect(() => {
    if (isOpen) {
      if (stationToEdit) {
        setFormData({
          region: stationToEdit.region || '',
          city: stationToEdit.city || '',
          street: stationToEdit.street || '',
          house: stationToEdit.house || '',
          phone: stationToEdit.phone || ''
        });
      } else {
        setFormData({region: '', city: '', street: '', house: '', phone: '' });
      }
    }
  }, [isOpen, stationToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = stationToEdit 
      ? `http://localhost:3000/logistics/stations/${stationToEdit.id}`
      : 'http://localhost:3000/logistics/stations';
    const method = stationToEdit ? 'PUT' : 'POST';

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
      alert('Ошибка при сохранении филиала');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '400px' }}>
        <h2>{stationToEdit ? 'Редактировать филиал' : 'Добавить новый филиал'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Регион (например, Самарская обл.)" required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="Город" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="Улица" required value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="Дом" required value={formData.house} onChange={(e) => setFormData({...formData, house: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="Номер телефона" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ padding: '8px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationModal;