import React from 'react';
import { MOCK_APPLICATION, MOCK_CARS, MOCK_STAFF } from '../../data/mockData';

const ApplicationTable = ({ currentUser }) => {

  // 2. Создаем отфильтрованный список перед return
  const filteredApps = MOCK_APPLICATION.filter(app => {
    if (currentUser?.role !== 'client') return true; // Админ видит всё
    const car = MOCK_CARS.find(c => c.id === app.car_id);
    return car?.owner_id === currentUser.personId; // Клиент видит только свои
  });

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Машина</th>
          <th>Администратор</th>
          <th>Описание проблем</th>
          <th>Дата регистрации</th>
        </tr>
      </thead>
      <tbody>
        {filteredApps.map(app => {
          const car = MOCK_CARS.find(c => c.id === app.car_id);
          const staff = MOCK_STAFF.find(s => s.id === app.administrator_id);
          
          return (
            <tr key={app.id}>
              <td>{car ? `${car.brand} ${car.model}` : `ID: ${app.car_id}`}</td>
              <td>{staff ? `${staff.surname} ${staff.name}` : `ID: ${app.administrator_id}`}</td>
              <td>{app.troubles_description}</td>
              <td>{app.registration_date}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ApplicationTable;