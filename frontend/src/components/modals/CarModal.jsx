import React, { useState, useEffect } from 'react';

const CarModal = ({ isOpen, onClose, carToEdit, onRefresh, clients }) => {
  const [formData, setFormData] = useState({
    clientId: '', brand: '', model: '', productionYear: '', vin: '', regNumber: ''
  });

  useEffect(() => {
    if (carToEdit) {
      setFormData({
        clientId: carToEdit.client_id || '',
        brand: carToEdit.brand || '',
        model: carToEdit.model || '',
        productionYear: carToEdit.production_year || '',
        vin: carToEdit.vin || '',
        regNumber: carToEdit.reg_number || ''
      });
    } else {
      setFormData({ clientId: '', brand: '', model: '', productionYear: '', vin: '', regNumber: '' });
    }
  }, [carToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = carToEdit 
      ? `http://localhost:3000/cars/${carToEdit.id}` 
      : 'http://localhost:3000/cars';
    const method = carToEdit ? 'PUT' : 'POST';

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

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h2>{carToEdit ? 'Редактировать автомобиль' : 'Новый автомобиль'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <select 
            required 
            value={formData.clientId} 
            onChange={(e) => setFormData({...formData, clientId: e.target.value})}
            style={{ padding: '8px' }}
          >
            <option value="">-- Выберите владельца --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.surname} {c.name} {c.patronymic} ({c.phone})
              </option>
            ))}
          </select>

          <input 
            type="text" placeholder="Марка (Brand)" required
            value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} 
          />
          <input 
            type="text" placeholder="Модель (Model)" required
            value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} 
          />
          <input 
            type="number" placeholder="Год выпуска" 
            value={formData.productionYear} onChange={(e) => setFormData({...formData, productionYear: e.target.value})} 
          />
          <input 
            type="text" placeholder="VIN-код" required maxLength="17"
            value={formData.vin} onChange={(e) => setFormData({...formData, vin: e.target.value.toUpperCase()})} 
          />
          <input 
            type="text" placeholder="Гос. номер (А123АА163)" required
            value={formData.regNumber} onChange={(e) => setFormData({...formData, regNumber: e.target.value.toUpperCase()})} 
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

export default CarModal;