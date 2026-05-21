import React, { useState, useEffect } from 'react';

const ServiceStationsTable = ({ stations, userRole, onEdit }) => {

    const canEdit = userRole === 'root';

    if (!stations) return <p>Загрузка данных...</p>;
    if (stations.length === 0) return <p>Филиалы не найдены.</p>;

    return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
          <th>ID</th>
          <th>Регион</th>
          <th>Город</th>
          <th>Адрес</th>
          <th>Номер телефона</th>
          <th style={{ width: '150px' }}>{canEdit ? 'Действия' : ''}</th>
        </tr>
      </thead>
      <tbody>
        {stations.map(st => (
          <tr key={st.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td>{st.id}</td>
            <td>{st.region}</td>
            <td>{st.city}</td>
            <td>{`${st.street}, д. ${st.house}`}</td>
            <td>{st.phone}</td>
            <td>
              {canEdit && (
                <button className="btn-primary" style={{ padding: '6px 12px', cursor: 'pointer' }} onClick={() => onEdit(st)}>
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

export default ServiceStationsTable;