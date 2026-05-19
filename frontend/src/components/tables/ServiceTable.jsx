import React, { useState, useEffect } from 'react';

const serviceTable = () => {

  const [services, setServices] = useState([]);
    
        useEffect(() => {
            fetch('http://localhost:3000/catalog')
                .then(res => res.json())
                .then(data => setServices(data))
                .catch(err => console.error(err));
        }, []);

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Название услуги</th>
          <th>Цена (руб.)</th>
        </tr>
      </thead>
      <tbody>
        {services.map(service => (
          <tr key={service.id}>
            <td>{service.name}</td>
            <td>{service.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default serviceTable;