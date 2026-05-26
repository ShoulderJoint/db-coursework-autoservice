import React, { useState, useEffect } from 'react';

const ContractModal = ({ isOpen, onClose, onRefresh, vendors }) => {
  const [vendorId, setVendorId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setVendorId('');
      setFile(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      return alert('Пожалуйста, выберите PDF файл договора');
    }

    // Создаем объект FormData для отправки файлов
    const formData = new FormData();
    formData.append('vendorId', vendorId);
    formData.append('contractFile', file); // Имя должно совпадать с upload.single('contractFile') на бэкенде

    try {
      const response = await fetch('http://localhost:3000/logistics/partscontracts', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        onRefresh(); 
        onClose();   
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch (error) {
      alert('Ошибка при сохранении договора');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h2>Новый договор с поставщиком</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <select 
            required 
            value={vendorId} 
            onChange={(e) => setVendorId(e.target.value)}
            style={{ padding: '8px' }}
          >
            <option value="">-- Выберите поставщика --</option>
            {vendors.map(v => (
              <option key={v.id} value={String(v.id)}>
                {v.name} (ИНН: {v.inn})
              </option>
            ))}
          </select>

          <div style={{ border: '1px dashed #cbd5e1', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
            <label style={{ cursor: 'pointer', display: 'block' }}>
              <strong>Прикрепить PDF-документ:</strong>
              <input 
                type="file" 
                accept=".pdf" // Ограничиваем выбор только PDF-файлами
                onChange={(e) => setFile(e.target.files[0])}
                style={{ marginTop: '10px', display: 'block', width: '100%' }}
                required
              />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">Загрузить и сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractModal;