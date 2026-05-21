import React, { useState, useEffect } from 'react';

const StaffTable = ({ staff, userRole, onEdit }) => {
  const canEdit = userRole === 'root';

  if (!staff) return <p>Загрузка данных из базы...</p>;
  if (staff.length === 0) return <p>Сотрудников пока нет.</p>;

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Филиал (Город)</th>
          <th>ФИО Сотрудника</th>
          <th>Логин</th>
          <th>Должность</th>
          <th>Статус(активен/неактивен)</th>
          <th style={{ width: '150px' }}>{canEdit ? 'Действия' : ''}</th>
        </tr>
      </thead>
      <tbody>
        {staff.map(s => (
          <tr key={s.id} style={{ opacity: s.is_active ? 1 : 0.6 }}>
            <td>{s.city}</td> 
            <td>{`${s.surname} ${s.name} ${s.patronymic || ''}`}</td>
            <td>{s.login}</td>
            <td>{s.role_name}</td>
            <td>
              {s.is_active 
                ? <span style={{ color: '#059669', fontWeight: 'bold' }}>Активен</span> 
                : <span style={{ color: '#dc2626', fontWeight: 'bold' }}>Отключен</span>
              }
            </td>
            <td>
              {canEdit && (
                <button 
                  className="btn-primary" 
                  style={{ padding: '6px 12px', cursor: 'pointer' }}
                  onClick={() => onEdit(s)}
                >
                  Редактировать
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaffTable;