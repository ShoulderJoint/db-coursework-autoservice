import React, { useState, useEffect } from 'react';

const CarTable = ({ currentUser }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Берем данные текущего пользователя. 
        // Если в твоем объекте юзера ID лежит в personId, используем его
        const role = currentUser.role;
        const userId = currentUser.personId || currentUser.id;

        // Отправляем запрос с query-параметрами
        fetch(`http://localhost:3000/cars?role=${role}&userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                setCars(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка загрузки автопарка:', err);
                setLoading(false);
            });
    }, [currentUser]); // Перезапрашиваем данные, если сменился пользователь

    if (loading) return <p>Загрузка автопарка...</p>;

    return (
        <table className="data-table">
            <thead>
                <tr>
                    {/* Показываем колонку владельца только для персонала */}
                    {currentUser.role !== 'client' && <th>Владелец</th>}
                    <th>Марка</th>
                    <th>Модель</th>
                    <th>Год выпуска</th>
                    <th>VIN</th>
                    <th>Гос. номер</th>
                </tr>
            </thead>
            <tbody>
                {cars.map(car => (
                    <tr key={car.id}>
                        {/* Выводим ФИО владельца, если это не клиент */}
                        {currentUser.role !== 'client' && (
                            <td>{`${car.surname} ${car.name} ${car.patronymic}`}</td>
                        )}
                        <td>{car.brand}</td>
                        <td>{car.model}</td>
                        <td>{car.production_year}</td>
                        <td>{car.vin}</td>
                        {/* Изменено с license_plate на reg_number в соответствии с БД */}
                        <td>{car.reg_number}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CarTable;