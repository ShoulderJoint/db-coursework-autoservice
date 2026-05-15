import React from 'react';
import { MOCK_SPARE_PARTS_CONTRACTS } from '../../data/mockData';

const SparePartsContractsTable = () => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>ID Поставщика</th>
          <th>Дата</th>
          <th>Итоговая цена</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_SPARE_PARTS_CONTRACTS.map(c => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.vendor_id}</td>
            <td>{c.date}</td>
            <td>{c.total_price.toLocaleString()} руб.</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SparePartsContractsTable;