import React, { useState, useEffect } from 'react';

const VendorModal = ({ isOpen, onClose, vendorToEdit, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '', region: '', city: '', street: '', house: '', flat: '', postcode: '', inn: '', phone: ''
  });

  useEffect(() => {
    if (vendorToEdit) {
      setFormData({
        name: vendorToEdit.name || '',
        region: vendorToEdit.region || '',
        city: vendorToEdit.city || '',
        street: vendorToEdit.street || '',
        house: vendorToEdit.house || '',
        flat: vendorToEdit.flat || '',
        postcode: vendorToEdit.postcode || '',
        inn: vendorToEdit.inn || '',
        phone: vendorToEdit.phone || ''
      });
    } else {
      setFormData({
        name: '', region: '', city: '', street: '', house: '', flat: '', postcode: '', inn: '', phone: ''
      });
    }
  }, [vendorToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = vendorToEdit 
      ? `http://localhost:3000/logistics/vendors/${vendorToEdit.id}` 
      : 'http://localhost:3000/logistics/vendors';
    const method = vendorToEdit ? 'PUT' : 'POST';

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
      alert('Ошибка при сохранении поставщика');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '500px' }}>
        <h2>{vendorToEdit ? 'Редактировать поставщика' : 'Новый поставщик'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <input type="text" placeholder="Название организации" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="ИНН"  maxLength="12" required value={formData.inn} onChange={(e) => setFormData({...formData, inn: e.target.value})} />
          <input type="text" placeholder="Телефон" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          
          <h4 style={{ margin: '10px 0 0 0' }}>Юридический адрес</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input type="text" placeholder="Регион" required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} />
            <input type="text" placeholder="Город" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            <input type="text" placeholder="Улица" required value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} />
            <input type="text" placeholder="Дом" required value={formData.house} onChange={(e) => setFormData({...formData, house: e.target.value})} />
            <input type="text" placeholder="Офис/Квартира" value={formData.flat} onChange={(e) => setFormData({...formData, flat: e.target.value})} />
            <input type="text" placeholder="Почтовый индекс" maxLength="6" value={formData.postcode} onChange={(e) => setFormData({...formData, postcode: e.target.value})} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorModal;