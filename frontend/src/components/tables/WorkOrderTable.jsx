import React from 'react';

const WorkOrderTable = ({ orders, userRole, onEdit }) => {
  const canEdit = userRole == 'advisor';

  if (!orders) return <p>Загрузка списка заказ-нарядов...</p>;
  if (orders.length === 0) return <p>Заказ-нарядов пока нет.</p>;

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
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
          <th>ID</th>
          <th>ID заявки</th>
          <th>Мастер-приёмщик</th>
          <th>Филиал</th>
          <th>Статус</th>
          <th>Цена комплектующих</th>
          <th>Цена услуг</th>
          <th>К оплате</th>
          <th>Дата закрытия ЗН</th>
          {canEdit && <th>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.order_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td>{order.order_id}</td>
            <td>{order.application_id}</td>
            <td>{formatFullName(order.staff_surname, order.staff_name, order.staff_patronymic)}</td>
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
            {canEdit && (
              <td>
                <button 
                  className="btn-primary" 
                  style={{ padding: '6px 12px', cursor: 'pointer' }}
                  onClick={() => onEdit(order)}
                >
                  Редактировать
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkOrderTable;