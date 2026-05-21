import React, { useState, useEffect } from 'react';
import './style.css';
import {
  NAV_ITEMS, MOCK_ACCOUNTS, MOCK_ROLES, MOCK_JOB_TITLES, MOCK_CLIENTS, MOCK_CARS, MOCK_APPLICATION, MOCK_SERVICE_STATIONS, MOCK_STATUSES,
  MOCK_SERVICES, MOCK_STAFF, MOCK_VENDORS, MOCK_WORK_ORDERS, MOCK_SPARE_PARTS_CONTRACTS, MOCK_WORK_ORDER_SERVICES, MOCK_WORK_ORDER_SPARE_PARTS,
  MOCK_SPARE_PARTS_CONTRACT_ITEMS
} from './data/mockData';
import WorkOrderModal from './components/modals/WorkOrderModal';
import WorkOrderDetailsModal from './components/modals/WorkOrderDetailsModal';
import ClientModal from './components/modals/ClientModal';
import CarModal from './components/modals/CarModal';
import ApplicationModal from './components/modals/ApplicationModal';
import VendorModal from './components/modals/VendorModal';
import ContractModal from './components/modals/ContractModal';
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
import PartsContractsTable from './components/tables/SparePartsContractsTable';

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

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contracts, setContracts] = useState([]);


  const handleOpenPrimaryModal = () => {
    switch (activeTab) {
      case 'work-orders':
        setIsModalOpen(true);
        break;
      case 'clients':
        setSelectedClient(null);
        setIsClientModalOpen(true);
        break;
      case 'cars':
        setSelectedCar(null);
        setIsCarModalOpen(true);
        break;
      case 'applications':
        setSelectedApplication(null);
        setIsAppModalOpen(true);
        break;
      case 'vendors':
        setSelectedVendor(null);
        setIsVendorModalOpen(true);
        break;
      case 'contracts':
        setIsContractModalOpen(true);
        break;
      default:
        console.warn(`Нет обработчика создания для вкладки: ${activeTab}`);
        break;
    }
  };

  // Управление вкладками
  const handleTabClick = (tab) => setActiveTab(tab);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const loadClients = () => {
    fetch('http://localhost:3000/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error('Ошибка клиентов:', err));
  };

  const loadCars = () => {
    fetch('http://localhost:3000/cars')
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.error('Ошибка загрузки авто:', err));
  };

  const loadApplications = () => {
    fetch('http://localhost:3000/applications')
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error('Ошибка заявок:', err));
  }

  const loadVendors = () => {
    fetch('http://localhost:3000/logistics/vendors')
      .then(res => res.json())
      .then(data => setVendors(data))
      .catch(err => console.error('Ошибка загрузки поставщиков:', err));
  };

  const loadContracts = () => {
    fetch('http://localhost:3000/logistics/partscontracts')
      .then(res => res.json())
      .then(data => setContracts(data))
      .catch(err => console.error('Ошибка загрузки договоров:', err));
  };

  const [applications, setApplications] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stations, setStations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const host = 'http://localhost:3000';

    loadClients()
    loadCars();
    loadApplications();
    loadVendors();
    loadContracts();

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
              onOpenModal={handleOpenPrimaryModal}
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
                <WorkOrderTable currentUser={currentUser} />
              )}

              {activeTab === 'clients' && (
                <ClientsTable
                  clients={clients}
                  onEdit={(client) => {
                    setSelectedClient(client);
                    setIsClientModalOpen(true);
                  }}
                />
              )}

              {activeTab === 'cars' && (
                <CarTable
                  cars={cars}
                  onEdit={(car) => {
                    setSelectedCar(car);
                    setIsCarModalOpen(true);
                  }}
                />
              )}

              {activeTab === 'applications' && (
                <ApplicationTable
                  applications={applications}
                  onEdit={(app) => {
                    setSelectedApplication(app);
                    setIsAppModalOpen(true);
                  }}
                />
              )}
              {activeTab === 'staff' && (
                <StaffTable />
              )}
              {activeTab === 'service-stations' && (
                <ServiceStationsTable />
              )}
              {activeTab === 'service-catalog' && (
                <ServiceTable />
              )}
              {activeTab === 'vendors' && (
                <VendorsTable
                  vendors={vendors}
                  onEdit={(v) => {
                    setSelectedVendor(v);
                    setIsVendorModalOpen(true);
                  }}
                />
              )}
              {activeTab === 'contracts' && (
                <PartsContractsTable contracts={contracts} onRefresh={loadContracts} />
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
          <WorkOrderDetailsModal
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              loadOrders();
            }}
            orderId={selectedOrderId}
          />
          <ClientModal
            isOpen={isClientModalOpen}
            onClose={() => setIsClientModalOpen(false)}
            clientToEdit={selectedClient}
            onRefresh={loadClients}
          />
          <CarModal
            isOpen={isCarModalOpen}
            onClose={() => setIsCarModalOpen(false)}
            carToEdit={selectedCar}
            onRefresh={loadCars}
            clients={clients}
          />
          <ApplicationModal
            isOpen={isAppModalOpen}
            onClose={() => setIsAppModalOpen(false)}
            applicationToEdit={selectedApplication}
            onRefresh={loadApplications}
            cars={cars}
            staff={staff}
          />
          <VendorModal
            isOpen={isVendorModalOpen}
            onClose={() => setIsVendorModalOpen(false)}
            vendorToEdit={selectedVendor}
            onRefresh={loadVendors}
          />
          <ContractModal
            isOpen={isContractModalOpen}
            onClose={() => setIsContractModalOpen(false)}
            onRefresh={loadContracts}
            vendors={vendors} // Передаем список поставщиков, он у нас уже есть в App.jsx
          />
        </>
      )}
    </div>
  );
}

export default App;