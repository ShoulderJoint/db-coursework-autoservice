import React, { useState, useEffect } from 'react';

const ApplicationTable = ({ currentUser }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = currentUser?.role;
    const userId = currentUser?.personId || currentUser?.id;

    // Запрос к серверу с передачей роли и ID текущего пользователя
    fetch(`http://localhost:3000/applications?role=${role}&userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setApplications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка при загрузке заявок:', err);
        setLoading(false);
      });
  }, [currentUser]);

  if (loading) return <p>Загрузка списка заявок...</p>;

  // Форматирование даты в привычный вид (ДД.ММ.ГГГГ)
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  // Сборка ФИО из отдельных полей с обработкой пустых значений отчества
  const formatFullName = (surname, name, patronymic) => {
    if (!surname && !name) return 'Не назначен';
    return `${surname || ''} ${name || ''} ${patronymic || ''}`.trim().replace(/\s+/g, ' ');
  };

  const isClient = currentUser?.role === 'client';

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Дата</th>
          {!isClient && <th>Клиент</th>}
          <th>Автомобиль</th>
          <th>Гос. номер</th>
          <th>Описание проблемы</th>
          <th>Принял сотрудник</th>
        </tr>
      </thead>
      <tbody>
        {applications.map(app => (
          <tr key={app.id}>
            <td>{app.id}</td>
            <td>{formatDate(app.created_at)}</td>
            
            {/* Колонка клиента отображается только для персонала */}
            {!isClient && (
              <td>
                {formatFullName(app.client_surname, app.client_name, app.client_patronymic)}
              </td>
            )}
            
            <td>
              {`${app.brand} ${app.model} (${app.production_year} г.)`}
            </td>
            <td>{app.reg_number}</td>
            <td>{app.description || 'Нет описания'}</td>
            <td>
              {formatFullName(app.staff_surname, app.staff_name, app.staff_patronymic)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApplicationTable;