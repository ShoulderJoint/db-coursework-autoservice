import React, { useState, useEffect } from 'react';

const WorkOrderTable = ({ currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = currentUser?.role;
    const userId = currentUser?.personId || currentUser?.id;

    fetch(`http://localhost:3000/orders?role=${role}&userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        // API возвращает объект { orders: [...], meta: { statuses: [...] } }
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка при загрузке заказ-нарядов:', err);
        setLoading(false);
      });
  }, [currentUser]);

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
              {/* Если потребуется цветовое кодирование, классы нужно будет генерировать на основе status_name */}
              <span className="status-badge">
                {order.status_name || 'Н/Д'}
              </span>
            </td>
            <td>{Number(order.cost_parts || 0).toLocaleString('ru-RU')} руб.</td>
            <td>{Number(order.cost_services || 0).toLocaleString('ru-RU')} руб.</td>
            <td><strong>{Number(order.cost || 0).toLocaleString('ru-RU')} руб.</strong></td>
            <td>{formatDate(order.closed_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkOrderTable;