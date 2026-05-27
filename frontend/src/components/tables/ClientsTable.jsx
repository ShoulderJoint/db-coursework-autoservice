import React, { useState, useEffect } from 'react';

const ClientsTable = ({ clients, onEdit, userRole }) => {

  const canEdit = userRole === 'admin';

  if (!clients || clients.length === 0) {
    return <p>Клиентов пока нет. Добавьте первого!</p>;
  }

  const handleGrantAccess = async (client) => {
    if (!window.confirm(`Сгенерировать доступы для ${client.name} и отправить на почту?`)) return;

    try {
      // Путь может отличаться в зависимости от твоих настроек apiFetch
      const response = await fetch(`http://localhost:3000/clients/${client.id}/grant-access`, {
        method: 'POST',
        // Если твой бэкенд использует куки для авторизации, добавь credentials
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        alert('Доступы успешно сгенерированы и отправлены!');
        // Тут нужно вызвать функцию обновления таблицы клиентов, если она передается в пропсы, 
        // например: if (onRefresh) onRefresh();
      } else {
        const data = await response.json();
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка сети при выдаче доступа');
    }
  };

  return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
          <th>ID</th>
          <th>ФИО</th>
          <th>Телефон</th>
          <th>Электронная почта</th>
          <th>Логин</th>
          {canEdit && <th>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {clients.map(client => (
          <tr key={client.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td>{client.id}</td>
            <td>{`${client.surname || ''} ${client.name || ''} ${client.patronymic || ''}`.trim()}</td>
            <td>{client.phone}</td>
            <td>{client.email}</td>
            <td>{client.login}</td>
            
            {/* Все кнопки действий оборачиваем в один <td> */}
            {canEdit && (
              <td>
                {!client.login ? (
                  <button
                    className="btn-secondary"
                    style={{ marginRight: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}
                    onClick={() => handleGrantAccess(client)}
                  >
                    Выдать доступ
                  </button>
                ) : (
                  <span style={{ marginRight: '10px', color: '#16a34a', fontSize: '14px' }}>✓ Доступ есть</span>
                )}
                
                <button
                  className="btn-primary"
                  style={{ padding: '6px 12px', cursor: 'pointer' }}
                  onClick={() => onEdit(client)}
                >
                  Редактировать
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientsTable;