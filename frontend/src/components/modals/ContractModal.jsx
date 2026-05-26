import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../api';

const ContractModal = ({ isOpen, onClose, onRefresh, vendors, contractToEdit }) => {
  const [vendorId, setVendorId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (contractToEdit) {
        setVendorId(String(contractToEdit.vendor_id || ''));
      } else {
        setVendorId('');
      }
      setFile(null);
    }
  }, [isOpen, contractToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contractToEdit && !file) {
      return alert('Пожалуйста, выберите PDF файл договора');
    }

    const formData = new FormData();
    formData.append('vendorId', vendorId);
    if (file) {
      formData.append('contractFile', file); 
    }

    try {
      const endpoint = contractToEdit 
        ? `/logistics/partscontracts/${contractToEdit.id}` 
        : '/logistics/partscontracts';
      const method = contractToEdit ? 'PUT' : 'POST';
      
      const response = await apiFetch(endpoint, {
        method: method,
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
        <h2>{contractToEdit ? 'Редактирование договора' : 'Новый договор с поставщиком'}</h2>
        
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
              <strong>{contractToEdit ? 'Обновить PDF-документ (необязательно):' : 'Прикрепить PDF-документ:'}</strong>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ marginTop: '10px', display: 'block', width: '100%' }}
                required={!contractToEdit} // Требуем файл только при создании
              />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">
              {contractToEdit ? 'Сохранить изменения' : 'Загрузить и сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractModal;