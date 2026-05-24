import React, { useState, useEffect } from 'react';

const ClientsTable = ({ clients, onEdit, userRole }) => {

  const canEdit = userRole === 'admin';

  if (!clients || clients.length === 0) {
    return <p>Клиентов пока нет. Добавьте первого!</p>;
  }
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
            {canEdit && (
              <td>
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