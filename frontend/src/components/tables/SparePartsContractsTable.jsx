import React, { useState, useEffect } from 'react';

const PartsContractsTable = () => {

  const [partsContracts, setPartsContracts] = useState([]);
  
      useEffect(() => {
          fetch('http://localhost:3000/logistics/partscontracts')
              .then(res => res.json())
              .then(data => setPartsContracts(data))
              .catch(err => console.error(err));
      }, []);

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Поставщик</th>
          <th>Дата создания</th>
          <th>Последняя дата обновления</th>
          <th>PDF файл документа</th>
        </tr>
      </thead>
      <tbody>
        {partsContracts.map(pc => (
          <tr key={pc.id}>
            <td>{pc.id}</td>
            <td>{pc.name}</td>
            <td>{pc.created}</td>
            <td>{pc.updated || ''}</td>
            <td>{pc.file_name ? (
                <a 
                  href={`http://localhost:3000/uploads/contracts/${pc.file_name}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {pc.file_name}
                </a>
              ) : (
                'Файл не загружен'
              )}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PartsContractsTable;