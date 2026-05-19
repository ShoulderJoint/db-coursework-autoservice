import React, { useState, useEffect } from 'react';
import './style.css';
import {
  NAV_ITEMS, MOCK_ACCOUNTS, MOCK_ROLES, MOCK_JOB_TITLES, MOCK_CLIENTS, MOCK_CARS, MOCK_APPLICATION, MOCK_SERVICE_STATIONS, MOCK_STATUSES, 
  MOCK_SERVICES,MOCK_STAFF, MOCK_VENDORS, MOCK_WORK_ORDERS, MOCK_SPARE_PARTS_CONTRACTS, MOCK_WORK_ORDER_SERVICES, MOCK_WORK_ORDER_SPARE_PARTS,
  MOCK_SPARE_PARTS_CONTRACT_ITEMS
} from './data/mockData';
import WorkOrderModal from './components/modals/WorkOrderModal';
import LoginForm from './components/layout/LoginForm';
import { Sidebar, Header } from './components/layout/Navigation';
import WorkOrderTable from './components/tables/WorkOrderTable';
import CarTable from './components/tables/CarTable';
import ServiceTable from './components/tables/ServiceTable';
import ClientsTable from './components/tables/ClientsTable';
import ApplicationTable from './components/tables/ApplicationTable';
import StaffTable from './components/tables/StaffTable';
import ServiceStationsTable from './components/tables/ServiceStations';
import VendorsTable from './components/tables/VendorsTable';
import SparePartsContractsTable from './components/tables/SparePartsContractsTable';

/*├── data/
│ └── mockData.js // Все наши массивы (MOCK_CLIENTS, MOCK_CARS и т.д.)
├── components/
│ ├── Layout/
│ │ ├── Navigation.jsx // Сайдбар и шапка
│ │ └── LoginForm.jsx // Окно входа
│ ├── Tables/
│ │ ├── WorkOrderTable.jsx
│ │ ├── CarTable.jsx
│ │ └── ServiceTable.jsx
│ └── Modals/
│ └──   WorkOrderModal.jsx // Та самая большая форма создания ЗН
├── App.jsx // Главный файл: логика входа и переключения табов
└── style.css // Стили*/

function App() {

  // Текущий пользователь (изначально пустой)
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);



  // Управление вкладками
  const handleTabClick = (tab) => setActiveTab(tab);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const [applications, setApplications] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stations, setStations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
  const host = 'http://localhost:3000';

  // Загрузка заявок
  fetch(`${host}/applications`)
    .then(res => res.json())
    .then(data => setApplications(data))
    .catch(err => console.error('Ошибка заявок:', err));

  // Загрузка сотрудников
  fetch(`${host}/staff`)
    .then(res => res.json())
    .then(data => setStaff(data.staff))
    .catch(err => console.error('Ошибка сотрудников:', err));

  // Загрузка филиалов (из logistics.js)
  fetch(`${host}/logistics/stations`)
    .then(res => res.json())
    .then(data => setStations(data))
    .catch(err => console.error('Ошибка филиалов:', err));

  // Загрузка клиентов
  fetch(`${host}/clients`)
    .then(res => res.json())
    .then(data => setClients(data))
    .catch(err => console.error('Ошибка клиентов:', err));

  // Загрузка автомобилей
  fetch(`${host}/cars`)
    .then(res => res.json())
    .then(data => setCars(data))
    .catch(err => console.error('Ошибка автомобилей:', err));

  // Загрузка услуг (каталога)
  fetch(`${host}/catalog`)
    .then(res => res.json())
    .then(data => setServices(data))
    .catch(err => console.error('Ошибка услуг:', err));

  fetch(`${host}/orders`)
    .then(res => res.json())
    .then(data => {
      if (data.meta && data.meta.statuses) {
        setStatuses(data.meta.statuses);
      }
    })
    .catch(err => console.error('Ошибка статусов:', err));
}, []);

  return (
    <div className="app-container">
      {!currentUser ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* Сайдбар стоял тут первым */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            currentUser={currentUser} 
            onLogout={() => setCurrentUser(null)} 
          />

          <main className="content">
            {/* Шапка стояла внутри main сразу первым элементом */}
            <Header 
              activeTab={activeTab} 
              currentUser={currentUser} 
              onOpenModal={() => setIsModalOpen(true)} 
            />
              <section id="view-container">
                {activeTab === 'dashboard' && (
                  <div className="dashboard-grid">
                    <div className="dashboard-card">
                      <h3>Профиль: {currentUser.name}</h3>
                      <p>Статус: Постоянный клиент</p>
                    </div>

                    {currentUser.role === 'client' && (
                      <>
                        <div className="dashboard-card highlight">
                          <h3>В работе</h3>
                          {/* Считаем ЗН со статусом "В работе" для этого клиента */}
                          <div className="big-number">2 автомобиля</div>
                        </div>
                        <div className="dashboard-card">
                          <h3>Ваши бонусы</h3>
                          <p>500 баллов</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'work-orders' && (
                  <WorkOrderTable currentUser={currentUser}/>
                )}

                {activeTab === 'clients' && (
                 <ClientsTable/>
                )}

                {activeTab === 'cars' && (
                  <CarTable currentUser={currentUser} />
                )}

                {activeTab === 'applications' && (
                  <ApplicationTable currentUser={currentUser} />
                )}
                {activeTab === 'staff' && (
                  <StaffTable/>
                )}
                {activeTab === 'service-stations' && (
                  <ServiceStationsTable/>
                )}
                {activeTab === 'service-catalog' && (
                  <ServiceTable />
                )}
                {activeTab === 'vendors' && (
                  <VendorsTable/>
                )}
                {activeTab === 'contracts' && (
                  <SparePartsContractsTable/>
                )}
              </section>
            </main>

          <WorkOrderModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            applications={applications}
            staff={staff}
            stations={stations}
            statuses={statuses}
            services={services}
            clients={clients}
            cars={cars}
          />
        </>
      )}
    </div>
  );
}

export default App;