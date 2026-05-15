import React from 'react';
import { MOCK_CARS, MOCK_CLIENTS } from '../../data/mockData';

const CarTable = ({ currentUser }) => {
  // Фильтруем список машин: если пользователь — клиент, показываем только его авто
  const filteredCars = MOCK_CARS.filter(car => 
    currentUser.role === 'client' ? car.owner_id === currentUser.personId : true
  );

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Владелец</th>
          <th>Марка</th>
          <th>Модель</th>
          <th>Год выпуска</th>
          <th>VIN</th>
          <th>Гос. номер</th>
        </tr>
      </thead>
      <tbody>
        {filteredCars.map(car => {
          // 2. Чтобы видеть ФИО хозяина вместо цифры ID:
          const owner = MOCK_CLIENTS.find(c => c.id === car.owner_id);
          
          return (
            <tr key={car.id}>
              {/* Показываем фамилию владельца */}
              <td>{owner ? `${owner.surname} ${owner.name}` : `ID: ${car.owner_id}`}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.production_year}</td>
              <td>{car.vin}</td>
              <td>{car.license_plate}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CarTable;