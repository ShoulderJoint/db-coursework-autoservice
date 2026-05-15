import React from 'react';
import {
  MOCK_WORK_ORDERS,
  MOCK_CARS,
  MOCK_STAFF,
  MOCK_SERVICE_STATIONS,
  MOCK_STATUSES,
  MOCK_APPLICATION,
  MOCK_WORK_ORDER_SERVICES,
  MOCK_WORK_ORDER_SPARE_PARTS
} from '../../data/mockData';

const WorkOrderTable = ({ currentUser }) => {

  // 2. Логика фильтрации
  const filteredOrders = MOCK_WORK_ORDERS.filter(order => {
    if (currentUser?.role !== 'client') return true;
    const app = MOCK_APPLICATION.find(a => a.id === order.application_id);
    const car = MOCK_CARS.find(c => c.id === app?.car_id);
    return car?.owner_id === currentUser.personId;
  });

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>ID заявки</th>
          <th>Мастер-приёмщик</th>
          <th>Филиал</th>
          <th>Статус</th>
          <th>Итоговая цена комплектующих</th>
          <th>Итоговая цена услуг</th>
          <th>К оплате</th>
          <th>Дата закрытия ЗН</th>
        </tr>
      </thead>
      <tbody>
        {filteredOrders.map(order => {
          // 1. Сначала находим заявку, так как филиал и мастер могут быть в ней
          const application = MOCK_APPLICATION.find(a => a.id == order.application_id);

          // 2. Ищем Мастера: пробуем advisor_id из заказа или administrator_id из заявки
          const staffId = order.service_advisor_id || application?.administrator_id;
          const staff = MOCK_STAFF.find(s => s.id == staffId);

          // 3. Ищем Филиал: пробуем station_id из заказа или service_station_id из заявки/мастера
          const stationId = order.station_id || application?.service_station_id || staff?.service_station_id;
          const station = MOCK_SERVICE_STATIONS.find(s => s.id == stationId);

          // 4. Статус (уже работал, оставляем)
          const status = MOCK_STATUSES.find(s => s.id == order.status_id);

          // 5. РАСЧЕТ ЦЕНЫ УСЛУГ (Ищем в MOCK_WORK_ORDER_SERVICES по id нашего ЗН)
          const servicesForOrder = MOCK_WORK_ORDER_SERVICES.filter(s => s.work_order_id == order.id);
          const servicesPrice = servicesForOrder.reduce((sum, s) => sum + (Number(s.applied_price) * Number(s.count || 1)), 0);

          // 6. РАСЧЕТ ЦЕНЫ КОМПЛЕКТУЮЩИХ (Ищем в MOCK_WORK_ORDER_SPARE_PARTS по id нашего ЗН)
          const partsForOrder = MOCK_WORK_ORDER_SPARE_PARTS.filter(p => p.work_order_id == order.id);
          const partsPrice = partsForOrder.reduce((sum, p) => sum + (Number(p.applied_price) * Number(p.count || 1)), 0);

          // 7. ИТОГО
          const totalPrice = servicesPrice + partsPrice;

          // 8. Дата: пробуем разные варианты ключа даты
          const closingDate = order.close_date || '—';

          return (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.application_id}</td>
              <td>{staff ? `${staff.surname} ${staff.name} ${staff.patronymic}` : 'Н/Д'}</td>
              <td>{station ? (
                `${station.city || ''}, ${station.street || ''}, д. ${station.house || ''}`
              ) : 'Н/Д'}</td>
              <td>
                <span className={`status-badge status-${order.status_id}`}>
                  {status ? status.name : 'Н/Д'}
                </span>
              </td>
              <td>{partsPrice.toLocaleString()} руб.</td>
              <td>{servicesPrice.toLocaleString()} руб.</td>
              <td><strong>{totalPrice.toLocaleString()} руб.</strong></td>
              <td>{closingDate}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default WorkOrderTable;