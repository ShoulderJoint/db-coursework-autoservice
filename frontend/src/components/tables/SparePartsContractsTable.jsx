import React, { useState, useEffect } from 'react';

const PartsContractsTable = ({ contracts, onRefresh }) => {

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот договор? Файл будет стерт с сервера.')) return;
    try {
      const res = await fetch(`http://localhost:3000/logistics/partscontracts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onRefresh(); // Перезапрашиваем список после успешного удаления
      } else {
        const err = await res.json();
        alert(`Ошибка при удалении: ${err.error || 'Неизвестная ошибка'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при выполнении запроса на удаление');
    }
  };

  if (!contracts) return <p>Загрузка договоров...</p>;
  if (contracts.length === 0) return <p>Договоров пока нет.</p>;

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
        {contracts.map(pc => (
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
            <td>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', cursor: 'pointer', color: '#ef4444', borderColor: '#ef4444' }}
                onClick={() => handleDelete(pc.id)}
              >
                Удалить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PartsContractsTable;