import React, { useState, useEffect } from 'react';

const WorkOrderDetailsModal = ({ isOpen, onClose, orderId }) => {
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [catalogParts, setCatalogParts] = useState([]);
  const [catalogServices, setCatalogServices] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentStatusId, setCurrentStatusId] = useState('');

  // Состояния для форм добавления позиций
  const [newPart, setNewPart] = useState({ sparePartId: '', count: 1, cost: 0 });
  const [newService, setNewService] = useState({ serviceId: '', count: 1, coeff: 1, cost: 0 });

  // Состояния для добавления запчасти
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partCount, setPartCount] = useState(1);

  // НОВЫЕ СОСТОЯНИЯ ДЛЯ ДЕТАЛЕЙ КЛИЕНТА:
  const [isClientPart, setIsClientPart] = useState(false);
  const [clientPartName, setClientPartName] = useState('');

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderData();
      loadCatalogData();
    }
  }, [isOpen, orderId]);

  const loadOrderData = async () => {
    try {
      // Текущие услуги ЗН
      const resServices = await fetch(`http://localhost:3000/orders/${orderId}/services`);
      setServices(await resServices.json());

      // Текущие запчасти ЗН
      const resParts = await fetch(`http://localhost:3000/orders/${orderId}/parts`);
      setParts(await resParts.json());

      // Данные самого ЗН (узнаем статус)
      const resOrder = await fetch(`http://localhost:3000/orders/${orderId}`);
      const orderData = await resOrder.json();
      setCurrentStatusId(orderData.status_id);
    } catch (err) {
      console.error('Ошибка загрузки данных заказ-наряда:', err);
    }
  };

  const loadCatalogData = async () => {
    try {
      const resParts = await fetch('http://localhost:3000/catalog/parts');
      setCatalogParts(await resParts.json());

      const resServices = await fetch('http://localhost:3000/catalog');
      setCatalogServices(await resServices.json());

      const resStatuses = await fetch('http://localhost:3000/orders/statuses');
      setStatuses(await resStatuses.json());
    } catch (err) {
      console.error('Ошибка загрузки каталогов:', err);
    }
  };

  // Смена статуса документа
  const handleStatusChange = async (newStatusId) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusId: parseInt(newStatusId) })
      });

      if (response.ok) {
        setCurrentStatusId(newStatusId);
        alert('Статус успешно изменен!');
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch (error) {
      alert('Не удалось изменить статус на сервере');
    }
  };

  // Сохранение новой услуги
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.serviceId) return alert('Выберите услугу');

    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: parseInt(newService.serviceId),
          count: newService.count,
          coefficient: newService.coeff,
          cost: newService.cost
        })
      });

      if (response.ok) {
        alert('Работа успешно добавлена!');
        setNewService({ serviceId: '', count: 1, coeff: 1, cost: 0 });
        loadOrderData(); // СУБД пересчитает итоговую сумму сама
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch (error) {
      alert('Ошибка добавления работы');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту услугу из заказ-наряда?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/services/${serviceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Перезагружаем данные ЗН, чтобы обновить список и итоговую сумму
        loadOrderData();
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch (error) {
      alert('Ошибка при выполнении запроса на удаление');
    }
  };

  const handleAddPart = async (e) => {
    e.preventDefault();

    const payload = isClientPart
      ? {
        sparePartId: null,
        customName: clientPartName.trim(),
        isClientProvided: true,
        count: Number(partCount),
        cost: 0
      }
      : {
        sparePartId: selectedPartId ? Number(selectedPartId) : null,
        customName: null,
        isClientProvided: false,
        count: Number(partCount),
        cost: null
      };

    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/parts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Комплектующие добавлены');
        setIsClientPart(false);
        setClientPartName('');
        setSelectedPartId('');
        setPartCount(1);
        loadOrderData();
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch (error) {
      alert('Ошибка добавления детали');
    }
  };

  const handleDeletePart = async (partId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту деталь из заказ-наряда?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/parts/${partId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Перезагружаем данные ЗН, чтобы обновить список и итоговую сумму
        loadOrderData();
      } else {
        const err = await response.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch (error) {
      alert('Ошибка при выполнении запроса на удаление');
    }
  };

  // Хелперы расчета стоимости услуги при изменении полей
  const handleServiceSelect = (serviceId) => {
    const selected = catalogServices.find(s => String(s.id) === String(serviceId));
    const basePrice = selected ? parseFloat(selected.price) : 0;
    setNewService({ ...newService, serviceId, cost: basePrice * newService.count * newService.coeff });
  };

  const handleServiceParamChange = (field, value) => {
    const updated = { ...newService, [field]: value };
    const selected = catalogServices.find(s => String(s.id) === String(updated.serviceId));
    const basePrice = selected ? parseFloat(selected.price) : 0;
    updated.cost = basePrice * updated.count * updated.coeff;
    setNewService(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '850px', width: '100%', backgroundColor: '#fff', padding: '25px', borderRadius: '8px', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Панель управления шапки */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>Заказ-наряд №{orderId}</h2>
          <div>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Текущий статус:</label>
            <select
              value={currentStatusId}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: '500' }}
            >
              {statuses.map(st => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* БЛОК РАБОТ И УСЛУГ */}
        <h3 style={{ margin: '15px 0 10px 0' }}>Выполняемые работы</h3>
        <table style={{ width: '100%', marginBottom: '10px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '8px' }}>Наименование услуги</th>
              <th>Кол-во</th>
              <th>Коэффициент</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px' }}>{s.name}</td>
                <td>{s.count} шт.</td>
                <td>{s.coefficient}</td>
                <td>{parseFloat(s.cost).toLocaleString('ru-RU')} руб.</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteService(s.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                    title="Удалить услугу"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Форма новой услуги */}
        <form onSubmit={handleAddService} style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <select value={newService.serviceId} onChange={(e) => handleServiceSelect(e.target.value)} style={{ flex: 3, padding: '6px' }}>
            <option value="">-- Добавить работу/операцию --</option>
            {catalogServices.map(cs => <option key={cs.id} value={cs.id}>{cs.name} ({cs.price} руб.)</option>)}
          </select>
          <input type="number" placeholder="Кол-во" min="1" value={newService.count} onChange={(e) => handleServiceParamChange('count', parseInt(e.target.value) || 1)} style={{ width: '65px', padding: '6px' }} />
          <input type="number" placeholder="Коэфф." step="0.1" min="0.1" value={newService.coeff} onChange={(e) => handleServiceParamChange('coeff', parseFloat(e.target.value) || 1)} style={{ width: '65px', padding: '6px' }} />
          <input type="text" value={`${newService.cost.toFixed(2)} руб.`} readOnly style={{ width: '110px', padding: '6px', backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', textAlign: 'center', borderRadius: '4px' }} />
          <button type="submit" style={{ padding: '6px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+</button>
        </form>

        {/* БЛОК КОМПЛЕКТУЮЩИХ */}
        <h3 style={{ margin: '15px 0 10px 0' }}>Установленные комплектующие</h3>
        <table style={{ width: '100%', marginBottom: '10px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '8px' }}>Наименование детали</th>
              <th>Количество</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 ? (
              <tr><td colSpan="3" style={{ padding: '10px', color: '#64748b', italic: 'true' }}>Детали пока не добавлялись</td></tr>
            ) : parts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px' }}>
                  {p.is_client_provided
                    ? <span style={{ color: '#0284c7' }}>{p.custom_name} (Своя)</span>
                    : p.catalog_name
                  }
                </td>
                <td>{p.count} шт.</td>
                <td>{parseFloat(p.cost).toLocaleString('ru-RU')} руб.</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleDeletePart(p.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                    title="Удалить деталь"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Форма новой запчасти */}
        <form onSubmit={handleAddPart} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginTop: '20px',
          padding: '15px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', width: '160px', flexShrink: 0, fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={isClientPart}
              onChange={(e) => {
                setIsClientPart(e.target.checked);
                if (e.target.checked) setSelectedPartId('');
                else setClientPartName('');
              }}
            />
            <span>Деталь<br />предоставлена<br />клиентом</span>
          </label>

          <div style={{ flex: 1, minWidth: 0 }}>
            {isClientPart ? (
              <input
                type="text"
                placeholder="Название детали..."
                required
                value={clientPartName}
                onChange={(e) => setClientPartName(e.target.value)}
                style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
              />
            ) : (
              <select
                required
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
              >
                <option value="">-- Выберите деталь со склада --</option>
                {catalogParts && catalogParts.map(part => (
                  <option key={part.id} value={String(part.id)}>
                    {part.name} (В наличии: {part.stock})
                  </option>
                ))}
              </select>
            )}
          </div>

          <input
            type="number"
            min="1"
            placeholder="Кол-во"
            required
            value={partCount}
            onChange={(e) => setPartCount(e.target.value)}
            style={{ padding: '8px', width: '70px', flexShrink: 0, boxSizing: 'border-box' }}
          />

          <div style={{ width: '90px', flexShrink: 0, fontSize: '13px', lineHeight: '1.2' }}>
            {isClientPart ? (
              <span style={{ fontWeight: 'bold' }}>Стоимость:<br />0 руб.</span>
            ) : (
              <span style={{ fontWeight: 'bold' }}>Стоимость<br />со склада</span>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ flexShrink: 0, padding: '8px 16px', whiteSpace: 'nowrap' }}>
            Добавить в<br />заказ-наряд
          </button>
        </form>

        {/* Подвал */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 24px', cursor: 'pointer', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderDetailsModal;