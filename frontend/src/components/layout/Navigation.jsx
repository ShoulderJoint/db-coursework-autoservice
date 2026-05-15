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

// 2. ВЕРНАЯ ШАПКА (копируем твой <header className="content-header">)
export const Header = ({ activeTab, onOpenModal, currentUser }) => (
  <header className="content-header">
    <h1>{NAV_ITEMS.find(i => i.id === activeTab)?.label || 'Система'}</h1>
    <div className="header-actions">
      {activeTab === 'work-orders' && currentUser?.role === 'advisor' && (
        <button className="btn-primary" onClick={onOpenModal}>
          + Создать ЗН
        </button>
      )}
    </div>
  </header>
);