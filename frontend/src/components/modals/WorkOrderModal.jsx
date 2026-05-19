import React, { useState } from 'react';

const WorkOrderModal = ({ 
  isOpen, 
  onClose, 
  applications, 
  staff, 
  stations, 
  statuses, 
  services,
  clients,
  cars
}) => {
  // Состояния для формы ЗН
  const [orderData, setOrderData] = useState({
    applicationId: '',
    staffId: '',
    stationId: '',
    statusId: 1
  });

  const [selectedServices, setSelectedServices] = useState([
    { rowId: Date.now(), serviceId: 0, price: 0, coeff: 1, count: 1, cost: 0 }
  ]);

  if (!isOpen) return null;

  const safeApplications = Array.isArray(applications) ? applications : [];
  const safeStaff = Array.isArray(staff) ? staff : (staff?.staff || []);
  const safeStations = Array.isArray(stations) ? stations : [];
  const safeStatuses = Array.isArray(statuses) ? statuses : (statuses?.meta?.statuses || []);
  const safeServices = Array.isArray(services) ? services : [];

  // Логика поиска связанных данных
  const selectedApp = safeApplications.find(a => String(a.id) === String(orderData.applicationId));
  

  // Функции управления строками
  const addServiceRow = () => {
    setSelectedServices([
      ...selectedServices,
      { rowId: Date.now(), serviceId: 0, price: 0, coeff: 1, count: 1, cost: 0 }
    ]);
  };

  const updateRow = (rowId, field, value) => {
    setSelectedServices(prev => prev.map(row => {
      if (row.rowId === rowId) {
        const updated = { ...row, [field]: value };
        if (field === 'serviceId') {
          const selectedService = services.find(s => s.id === parseInt(value));
          updated.price = selectedService ? selectedService.price : 0;
        }
        const p = parseFloat(updated.price) || 0;
        const c = parseFloat(updated.coeff) || 0;
        const cnt = parseFloat(updated.count) || 0;
        updated.cost = p * c * cnt;
        return updated;
      }
      return row;
    }));
  };

  const grandTotal = selectedServices.reduce((sum, row) => sum + row.cost, 0);
  
const handleSubmit = async (e) => {
    e.preventDefault();

    // Фильтруем только те строки, где реально выбрана услуга
    const validServices = selectedServices.filter(s => s.serviceId !== 0 && s.serviceId !== '0');

    const payload = {
      applicationId: orderData.applicationId,
      staffId: orderData.staffId,
      statusId: orderData.statusId,
      services: validServices
    };

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Заказ-наряд успешно создан!');
        // Сброс формы в дефолтное состояние
        setOrderData({ applicationId: '', staffId: '', stationId: '', statusId: 1 });
        setSelectedServices([{ rowId: Date.now(), serviceId: 0, price: 0, coeff: 1, count: 1, subtotal: 0 }]);
        onClose(); 
      } else {
        const err = await response.json();
        alert(`Ошибка сервера: ${err.error}`);
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      alert('Не удалось связаться с сервером');
    }
  };

  const handleCancel = () => {
    setOrderData({ applicationId: '', staffId: '', stationId: '', statusId: 1 });
    setSelectedServices([{ rowId: Date.now(), serviceId: 0, price: 0, coeff: 1, count: 1, cost: 0 }]);
    onClose();
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '800px', width: '100%' }}>
        <h2>Новый заказ-наряд</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-column">
              <div className="form-group">
                <label>Основание (Заявка):</label>
                <select
                  value={orderData.applicationId}
                  onChange={(e) => setOrderData({ ...orderData, applicationId: e.target.value })}
                >
                  <option value="">Выберите активную заявку...</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>
                      Заявка №{app.id} ({app.description.substring(0, 30)}...)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Клиент:</label>
                <input 
                  type="text" 
                  readOnly 
                  style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc' }}
                  value={selectedApp ? `${selectedApp.client_surname || ''} ${selectedApp.client_name || ''}`.trim() : 'Выберите заявку'} 
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Автомобиль:</label>
                <input 
                  type="text" 
                  readOnly 
                  style={{ width: '100%', padding: '8px', backgroundColor: '#f8fafc' }}
                  value={selectedApp ? `${selectedApp.brand || ''} ${selectedApp.model || ''} (${selectedApp.reg_number || ''})` : 'Выберите заявку'} 
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Филиал исполнения:</label>
                <select value={orderData.stationId} onChange={(e) => setOrderData({ ...orderData, stationId: e.target.value })}>
                  <option value="">Выберите филиал...</option>
                  {stations.map(st => <option key={st.id} value={st.id}>{st.city}, {st.street}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Мастер-приёмщик:</label>
                <select value={orderData.staffId} onChange={(e) => setOrderData({ ...orderData, staffId: e.target.value })}>
                  <option value="">Выберите мастера...</option>
                  {staff.filter(s => s.role_id === 3).map(s => (
                    <option key={s.id} value={s.id}>{s.surname} {s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <h3>Услуги и коэффициенты</h3>
          <div className="services-container">
            {selectedServices.map((row) => (
              <div key={row.rowId} style={{ display: 'grid', gridTemplateColumns: '2fr 100px 70px 70px 120px', gap: '10px', marginBottom: '10px', width: '100%' }}>
                <select value={row.serviceId} onChange={(e) => updateRow(row.rowId, 'serviceId', e.target.value)}>
                  <option value="0">Выберите услугу...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input type="number" value={row.price} readOnly placeholder="Цена" />
                <input type="number" step="0.1" value={row.coeff} onChange={(e) => updateRow(row.rowId, 'coeff', e.target.value)} placeholder="Коэфф." />
                <input type="number" value={row.count} onChange={(e) => updateRow(row.rowId, 'count', e.target.value)} placeholder="Кол-во" />
                <input type="number" value={row.cost.toFixed(2)} readOnly style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            ))}
          </div>

          <button type="button" className="btn-secondary" onClick={addServiceRow}>+ Добавить услугу</button>
          <div className="total-section" style={{ marginTop: '20px', fontSize: '1.2rem' }}>
            <strong>Всего к оплате: {grandTotal.toFixed(2)} руб.</strong>
          </div>
          <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-text" onClick={handleCancel}>Отмена</button>
            <button type="submit" className="btn-primary">Сохранить ЗН</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkOrderModal;