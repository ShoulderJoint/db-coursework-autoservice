import React, { useState, useEffect } from 'react';

const StaffTable = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Запрос к созданному выше роуту
    fetch('http://localhost:3000/staff') 
      .then(res => res.json())
      .then(data => {
      setStaff(data.staff);
      setLoading(false);
})
      .catch(err => console.error('Ошибка загрузки:', err));
  }, []);

  if (loading) return <p>Загрузка данных из базы...</p>;

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Филиал (Город)</th>
          <th>ФИО Сотрудника</th>
          <th>Должность</th>
        </tr>
      </thead>
      <tbody>
        {staff.map(s => (
          <tr key={s.id}>
            {/* st.city из схемы */}
            <td>{s.city}</td> 
            {/* s.surname, s.name, s.patronymic из схемы */}
            <td>{`${s.surname} ${s.name} ${s.patronymic || ''}`}</td>
            {/* r.name (как role_name) из схемы */}
            <td>{s.role_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaffTable;