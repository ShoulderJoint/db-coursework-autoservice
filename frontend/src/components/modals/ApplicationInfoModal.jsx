import React from 'react';

const ApplicationInfoModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  return (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '500px', width: '100%', backgroundColor: '#fff', padding: '25px', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          Информация о заявке №{application.id}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
          <div>
            <strong>Автомобиль:</strong>
            <p style={{ margin: '4px 0 0 0' }}>{application.brand} {application.model} ({application.reg_number})</p>
          </div>
          <div>
            <strong>Клиент:</strong>
            <p style={{ margin: '4px 0 0 0' }}>{`${application.client_surname || ''} ${application.client_name || ''} ${application.client_patronymic || ''}`.trim() || '—'}</p>
          </div>
          <div>
            <strong>Описание проблемы:</strong>
            <p style={{ margin: '4px 0 0 0', background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              {application.description}
            </p>
          </div>
          <div>
            <strong>Дата создания:</strong>
            <p style={{ margin: '4px 0 0 0' }}>{new Date(application.created_at).toLocaleString('ru-RU')}</p>
          </div>
          <div>
            <strong>Администратор, оформивший заявку:</strong>
            <p style={{ margin: '4px 0 0 0' }}>{`${application.staff_surname || ''} ${application.staff_name || ''} ${application.staff_patronymic || ''}`.trim() || '—'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '8px 20px' }}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInfoModal;