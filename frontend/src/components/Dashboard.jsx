import React from 'react';

const Dashboard = ({ currentUser, clients, cars, applications, orders }) => {
  if (!currentUser) return null;

  const isClient = currentUser.role === 'client';

  const clientCarsCount = cars?.length || 0;
  const clientAppsCount = applications?.length || 0;
  const clientActiveOrders = orders?.filter(o => 
    o.status_name !== 'Завершён' && o.status_name !== 'Отменён'
  ).length || 0;
  
  const totalClients = clients?.length || 0;
  const totalCars = cars?.length || 0;
  const totalApps = applications?.length || 0;
  const ordersInWork = orders?.filter(o => o.status_name === 'В работе').length || 0;

  const cardStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flex: '1',
    minWidth: '200px'
  };

  const numberStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: '10px'
  };

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
        Добро пожаловать, {currentUser.name}!
      </h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {isClient ? (
          <>
            <div style={cardStyle}>
              <div style={{ color: '#64748b' }}>Мои автомобили</div>
              <div style={numberStyle}>{clientCarsCount}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#64748b' }}>Активные заявки</div>
              <div style={numberStyle}>{clientAppsCount}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#64748b' }}>Машины в ремонте (ЗН)</div>
              <div style={numberStyle}>{clientActiveOrders}</div>
            </div>
          </>
        ) : (
          <>
            <div style={cardStyle}>
              <div style={{ color: '#64748b' }}>Заказ-наряды "В работе"</div>
              <div style={numberStyle}>{ordersInWork}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#64748b' }}>Всего заявок</div>
              <div style={numberStyle}>{totalApps}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#64748b' }}>Клиентская база</div>
              <div style={numberStyle}>{totalClients}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#64748b' }}>Автомобилей в базе</div>
              <div style={numberStyle}>{totalCars}</div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default Dashboard;