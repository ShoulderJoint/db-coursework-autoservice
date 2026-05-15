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
    advisorId: '',
    stationId: '',
    statusId: 1
  });

  const [selectedServices, setSelectedServices] = useState([
    { rowId: Date.now(), serviceId: 0, price: 0, coeff: 1, count: 1, subtotal: 0 }
  ]);

  if (!isOpen) return null;

  // Логика поиска связанных данных
  const selectedApp = applications.find(a => a.id === parseInt(orderData.applicationId));
  const selectedCar = selectedApp ? cars.find(c => c.id === selectedApp.car_id) : null;
  const selectedOwner = selectedCar ? clients.find(c => c.id === selectedCar.owner_id) : null;

  // Функции управления строками
  const addServiceRow = () => {
    setSelectedServices([
      ...selectedServices,
      { rowId: Date.now(), serviceId: 0, price: 0, coeff: 1, count: 1, subtotal: 0 }
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
        updated.subtotal = p * c * cnt;
        return updated;
      }
      return row;
    }));
  };

  const grandTotal = selectedServices.reduce((sum, row) => sum + row.subtotal, 0);

  const handleClose = () => {
    setOrderData({ applicationId: '', advisorId: '', stationId: '', statusId: 1 });
    setSelectedServices([{ rowId: Date.now(), serviceId: 0, price: 0, coeff: 1, count: 1, subtotal: 0 }]);
    onClose();
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '800px', width: '100%' }}>
        <h2>Новый заказ-наряд</h2>
        <form onSubmit={(e) => e.preventDefault()}>
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
                      Заявка №{app.id} ({app.troubles_description.substring(0, 30)}...)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Клиент:</label>
                <input type="text" readOnly value={selectedOwner ? `${selectedOwner.surname} ${selectedOwner.name}` : 'Выберите заявку'} style={{ backgroundColor: '#f8fafc' }} />
              </div>
              <div className="form-group">
                <label>Автомобиль:</label>
                <input type="text" readOnly value={selectedCar ? `${selectedCar.brand} ${selectedCar.model} (${selectedCar.license_plate})` : 'Выберите заявку'} style={{ backgroundColor: '#f8fafc' }} />
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
                <select value={orderData.advisorId} onChange={(e) => setOrderData({ ...orderData, advisorId: e.target.value })}>
                  <option value="">Выберите мастера...</option>
                  {staff.filter(s => s.role === 'Мастер-приемщик').map(s => (
                    <option key={s.id} value={s.id}>{s.surname} {s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Текущий статус:</label>
                <select value={orderData.statusId} onChange={(e) => setOrderData({ ...orderData, statusId: e.target.value })}>
                  {statuses.map(stat => <option key={stat.id} value={stat.id}>{stat.name}</option>)}
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
                <input type="number" value={row.subtotal.toFixed(2)} readOnly style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            ))}
          </div>

          <button type="button" className="btn-secondary" onClick={addServiceRow}>+ Добавить услугу</button>
          <div className="total-section" style={{ marginTop: '20px', fontSize: '1.2rem' }}>
            <strong>Всего к оплате: {grandTotal.toFixed(2)} руб.</strong>
          </div>
          <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-text" onClick={handleClose}>Отмена</button>
            <button type="submit" className="btn-primary" onClick={handleClose}>Сохранить ЗН</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkOrderModal;