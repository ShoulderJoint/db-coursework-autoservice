import React, { useState, useEffect } from 'react';

const CarTable = ({ cars, onEdit, userRole }) => {

  const canEdit = userRole === 'admin';
  const showOwner = userRole !== 'client';

  if (!cars || cars.length === 0) {
    return <p>Автомобилей пока нет. Добавьте первый!</p>;
  }

  return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
          <th>ID</th>
          {showOwner && <th>Владелец</th>}
          <th>Автомобиль</th>
          <th>Год</th>
          <th>VIN</th>
          <th>Гос. номер</th>
          {canEdit && <th>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {cars.map(car => (
          <tr key={car.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td>{car.id}</td>
            {showOwner && (
              <td>{`${car.client_surname || ''} ${car.client_name || ''} ${car.client_patronymic}`.trim() || '—'}</td>
            )}
            <td>{car.brand} {car.model}</td>
            <td>{car.production_year}</td>
            <td>{car.vin}</td>
            <td>{car.reg_number}</td>
            <td>
              {canEdit && (
                <td>
                  <button
                    className="btn-primary"
                    style={{ padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => onEdit(car)}
                  >
                    Редактировать
                  </button>
                </td>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CarTable;