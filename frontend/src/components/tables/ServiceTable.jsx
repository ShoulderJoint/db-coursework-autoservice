import React from 'react';

const ServiceTable = ({ services, userRole, onEdit }) => {
  const canEdit = userRole === 'root';

  if (!services) return <p>Загрузка данных...</p>;
  if (services.length === 0) return <p>Каталог услуг пуст.</p>;

  return (
    <table className="data-table">
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          <th style={{ width: '25%' }}>Наименование услуги</th>
          <th style={{ width: '45%' }}>Описание</th>
          <th style={{ width: '15%' }}>Время</th>
          <th style={{ width: '15%' }}>Стоимость</th>
          {canEdit && <th style={{ width: '130px' }}>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {services.map(s => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.description || '-'}</td>
            <td>{s.estimated_time_minutes ? `${s.estimated_time_minutes} мин.` : '-'}</td>
            <td style={{ whiteSpace: 'nowrap' }}>
              {parseFloat(s.price).toLocaleString('ru-RU')} руб.
            </td>
            {canEdit && (
              <td>
                <button className="btn-primary" onClick={() => onEdit(s)}>
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

export default ServiceTable;