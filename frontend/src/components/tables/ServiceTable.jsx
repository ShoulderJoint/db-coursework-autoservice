import React, { useState, useEffect } from 'react';

const ServiceTable = ({ services, userRole, onEdit }) => {

  const canEdit = userRole === 'root';

  if (!services) return <p>Загрузка данных...</p>;
  if (services.length === 0) return <p>Каталог услуг пуст.</p>;

  return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
          <th>Наименование услуги</th>
          <th>Базовая стоимость</th>
          <th style={{ width: '150px' }}>{canEdit ? 'Действия' : ''}</th>
        </tr>
      </thead>
      <tbody>
        {services.map(s => (
          <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td>{s.name}</td>
            <td>{parseFloat(s.price).toLocaleString('ru-RU')} руб.</td>
            <td>
              {canEdit && (
                <button className="btn-primary" style={{ padding: '6px 12px', cursor: 'pointer' }} onClick={() => onEdit(s)}>
                  Редактировать
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServiceTable;