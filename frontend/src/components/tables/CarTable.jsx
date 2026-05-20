import React, { useState, useEffect } from 'react';

const CarTable = ({ cars, onEdit }) => {
    if (!cars || cars.length === 0) {
    return <p>Автомобилей пока нет. Добавьте первый!</p>;
  }

    return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
          <th>ID</th>
          <th>Владелец</th>
          <th>Автомобиль</th>
          <th>Год</th>
          <th>VIN</th>
          <th>Гос. номер</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {cars.map(car => (
          <tr key={car.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td>{car.id}</td>
            <td>{`${car.surname || ''} ${car.name || ''}`.trim()}</td>
            <td>{car.brand} {car.model}</td>
            <td>{car.production_year}</td>
            <td>{car.vin}</td>
            <td>{car.reg_number}</td>
            <td>
              <button 
                className="btn-primary" 
                style={{ padding: '6px 12px', cursor: 'pointer' }}
                onClick={() => onEdit(car)}
              >
                Редактировать
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CarTable;