import React, { useState, useEffect, useCallback } from 'react';
import WorkOrderDetailsModal from '../modals/WorkOrderDetailsModal';

const WorkOrderTable = ({ currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrders = useCallback(() => {
    const role = currentUser?.role;
    const userId = currentUser?.personId || currentUser?.id;

    fetch(`http://localhost:3000/orders?role=${role}&userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка при загрузке заказ-нарядов:', err);
        setLoading(false);
      });
  }, [currentUser]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) return <p>Загрузка списка заказ-нарядов...</p>;

  // Вспомогательные функции для форматирования
  const formatFullName = (surname, name, patronymic) => {
    if (!surname && !name) return 'Не назначен';
    return `${surname || ''} ${name || ''} ${patronymic || ''}`.trim().replace(/\s+/g, ' ');
  };

  const formatAddress = (city, street, house) => {
    if (!city) return 'Н/Д';
    return `${city}, ${street}, д. ${house}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    // Обернули таблицу и модалку в один div (React требует один корневой элемент)
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID заявки</th>
            <th>Мастер-приёмщик</th>
            <th>Филиал</th>
            <th>Статус</th>
            <th>Цена комплектующих</th>
            <th>Цена услуг</th>
            <th>К оплате</th>
            <th>Дата закрытия ЗН</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.application_id}</td>
              <td>
                {formatFullName(order.staff_surname, order.staff_name, order.staff_patronymic)}
              </td>
              <td>{formatAddress(order.city, order.street, order.house)}</td>
              <td>
                <span className="status-badge">
                  {order.status_name || 'Н/Д'}
                </span>
              </td>
              <td>{Number(order.cost_parts || 0).toLocaleString('ru-RU')} руб.</td>
              <td>{Number(order.cost_services || 0).toLocaleString('ru-RU')} руб.</td>
              <td><strong>{Number(order.cost || 0).toLocaleString('ru-RU')} руб.</strong></td>
              <td>{formatDate(order.closed_at)}</td>
              
              {/* Ячейка с кнопкой */}
              <td>
                <button 
                  className="btn-primary" 
                  style={{ padding: '6px 12px', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedOrderId(order.order_id);
                    setIsDetailsOpen(true);
                  }}
                >
                  Редактировать
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <WorkOrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          loadOrders(); 
        }}
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default WorkOrderTable;