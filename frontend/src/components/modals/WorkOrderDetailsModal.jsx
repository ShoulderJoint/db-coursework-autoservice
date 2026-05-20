import React, { useState, useEffect } from 'react';

const WorkOrderDetailsModal = ({ isOpen, onClose, orderId }) => {
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [catalogParts, setCatalogParts] = useState([]);
  
  // Состояние для формы добавления запчасти
  const [newPart, setNewPart] = useState({ sparePartId: '', count: 1, cost: 0 });

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderData();
      loadCatalogParts();
    }
  }, [isOpen, orderId]);

  const loadOrderData = async () => {
    try {
      // Загружаем услуги этого ЗН
      const resServices = await fetch(`http://localhost:3000/orders/${orderId}/services`);
      const dataServices = await resServices.json();
      setServices(dataServices);

      // Загружаем запчасти этого ЗН
      const resParts = await fetch(`http://localhost:3000/orders/${orderId}/parts`);
      const dataParts = await resParts.json();
      setParts(dataParts);
    } catch (err) {
      console.error('Ошибка загрузки данных ЗН:', err);
    }
  };

  const loadCatalogParts = () => {
    // Вызываем роут, который ты добавил в шаге 2
    fetch('http://localhost:3000/catalog/parts') 
      .then(res => res.json())
      .then(data => setCatalogParts(data))
      .catch(err => console.error(err));
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    if (!newPart.sparePartId) return alert('Выберите запчасть');

    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/parts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPart)
      });

      if (response.ok) {
        alert('Запчасть добавлена!');
        setNewPart({ sparePartId: '', count: 1, cost: 0 });
        loadOrderData(); // Перезагружаем списки, триггер в БД уже пересчитал суммы!
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '700px', width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>Заказ-наряд №{orderId} (Просмотр и дефектовка)</h2>
        
        <h3>Выполненные работы / Услуги</h3>
        <ul>
          {services.map(s => (
            <li key={s.id}>{s.name} — {s.count} шт. x {s.cost} руб.</li>
          ))}
        </ul>

        <h3>Установленные комплектующие</h3>
        {parts.length === 0 ? <p>Запчасти еще не добавлялись</p> : (
          <ul>
            {parts.map(p => (
              <li key={p.id}>{p.name} — {p.count} шт. ({parseFloat(p.cost).toFixed(2)} руб.)</li>
            ))}
          </ul>
        )}

        <h4 style={{ marginTop: '20px' }}>Добавить запчасть из склада:</h4>
        <form onSubmit={handleAddPart} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select 
            value={newPart.sparePartId} 
            onChange={(e) => setNewPart({...newPart, sparePartId: e.target.value})}
            style={{ padding: '5px', flex: 2 }}
          >
            <option value="">-- Выберите деталь --</option>
            {catalogParts.map(cp => <option key={cp.id} value={cp.id}>{cp.name}</option>)}
          </select>
          <input 
            type="number" 
            placeholder="Кол-во" 
            value={newPart.count} 
            onChange={(e) => setNewPart({...newPart, count: parseInt(e.target.value)})} 
            style={{ width: '60px', padding: '5px' }}
          />
          <input 
            type="number" 
            placeholder="Цена" 
            value={newPart.cost} 
            onChange={(e) => setNewPart({...newPart, cost: parseFloat(e.target.value)})} 
            style={{ width: '90px', padding: '5px' }}
          />
          <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>+</button>
        </form>

        <button type="button" onClick={onClose} style={{ padding: '10px 20px', cursor: 'pointer' }}>Закрыть</button>
      </div>
    </div>
  );
};

export default WorkOrderDetailsModal;