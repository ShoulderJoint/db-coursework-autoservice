import React from 'react';

const ApplicationTable = ({ applications, onEdit, userRole }) => {

  const canEdit = userRole === 'admin';

  if (!applications) return <p>Загрузка данных из БД...</p>;
  if (applications.length === 0) return <p>Заявок пока нет.</p>;

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
          <th>ID</th>
          <th>Автомобиль</th>
          <th>Администратор</th>
          <th>Описание</th>
          <th>Запланировано на</th>
          <th>Дата создания</th>
          <th>Дата внесения изменений</th>
          {canEdit && <th>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {applications.map(app => (
          <tr key={app.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td>{app.id}</td>
            <td>{app.brand} {app.model} {app.reg_number ? `(${app.reg_number})` : ''}</td>
            <td>{`${app.staff_surname || ''} ${app.staff_name || ''}`.trim()}</td>
            <td>{app.description}</td>
            <td style={{ fontWeight: app.scheduled_at ? 'bold' : 'normal', color: app.scheduled_at ? '#2563eb' : 'inherit' }}>
              {formatDate(app.scheduled_at)}
            </td>
            <td>{formatDate(app.created_at)}</td>
            <td>{formatDate(app.updated_at)}</td>
            {canEdit && (
              <td>
                <button
                  className="btn-primary"
                  style={{ padding: '6px 12px', cursor: 'pointer' }}
                  onClick={() => onEdit(app)}
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

export default ApplicationTable;