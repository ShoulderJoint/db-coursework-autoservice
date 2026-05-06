import React from 'react';
import { MOCK_SERVICES } from '../../data/mockData';

const ServiceTable = () => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Название услуги</th>
          <th>Цена (руб.)</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_SERVICES.map(service => (
          <tr key={service.id}>
            <td>{service.name}</td>
            <td>{service.price.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServiceTable;