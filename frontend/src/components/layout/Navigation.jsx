import React from 'react';
import { NAV_ITEMS } from '../../data/mockData';

// 1. ВЕРНЫЙ САЙДБАР (копируем твой <nav className="sidebar">)
export const Sidebar = ({ activeTab, setActiveTab, currentUser, onLogout }) => (
  <nav className="sidebar">
    <div className="sidebar-header">
      <span className="logo-text">СТО Система</span>
      <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '10px' }}>
        Вы вошли как: <br /><strong>{currentUser?.surname} {currentUser?.name}</strong>
      </div>
      <button
        onClick={onLogout}
        style={{ marginTop: '10px', fontSize: '10px', padding: '4px' }}
      >
        Выйти
      </button>
    </div>

    <ul style={{ listStyle: 'none', padding: 0 }}>
      {NAV_ITEMS
        .filter(item => item.roles.includes(currentUser?.role))
        .map(item => (
          <li
            key={item.id}
            className={activeTab === item.id ? 'active' : ''}
            onClick={() => setActiveTab(item.id)}
            style={{ padding: '12px 20px', cursor: 'pointer' }}
          >
            {item.label}
          </li>
        ))
      }
    </ul>
  </nav>
);

export const Header = ({ activeTab, onOpenModal, currentUser }) => {
  const role = currentUser?.role;

  return (
    <header className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box', marginBottom: '20px', minHeight: '40px' }}>
      <h1>{NAV_ITEMS.find(i => i.id === activeTab)?.label || 'Система'}</h1>

      <div className="header-actions" style={{ display: 'flex', justifyContent: 'flex-end', minWidth: '200px' }}>

        {activeTab === 'work-orders' && ['advisor', 'root'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Создать ЗН</button>
        )}

        {activeTab === 'clients' && ['admin', 'root'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Добавить клиента</button>
        )}

        {activeTab === 'applications' && ['admin', 'root', 'advisor'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Создать заявку</button>
        )}

        {activeTab === 'cars' && ['admin', 'root'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Добавить авто</button>
        )}

        {activeTab === 'vendors' && ['advisor', 'root'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Добавить поставщика</button>
        )}

        {activeTab === 'contracts' && ['advisor', 'root'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Добавить договор</button>
        )}

        {activeTab === 'staff' && ['root'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Добавить работника</button>
        )}

        {activeTab === 'service-stations' && ['root'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Добавить филиал</button>
        )}

        {activeTab === 'service-catalog' && ['root', 'admin'].includes(role) && (
          <button className="btn-primary" onClick={onOpenModal}>+ Добавить услугу</button>
        )}
      </div>
    </header>
  );
};