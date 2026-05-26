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
import StaffModal from './components/modals/StaffModal';
import StationModal from './components/modals/StationModal';
import ServiceCatalogModal from './components/modals/ServiceCatalogModal';
import ApplicationInfoModal from './components/modals/ApplicationInfoModal';
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

import Dashboard from './components/Dashboard';

import { apiFetch } from './api';

function App() {

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

  const [orders, setOrders] = useState([]);

  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [contracts, setContracts] = useState([]);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffMeta, setStaffMeta] = useState(null);

  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const [isServiceCatalogModalOpen, setIsServiceCatalogModalOpen] = useState(false);
  const [selectedCatalogService, setSelectedCatalogService] = useState(null);

  const [isAppViewOpen, setIsAppViewOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState(null);

  const loadDataArray = async (endpoint, stateSetter, errorLabel) => {
    try {
      const response = await apiFetch(endpoint);
      const data = await response.json();

      if (Array.isArray(data)) {
        stateSetter(data);
      } else {
        console.error(`[${errorLabel}] Сервер вернул не массив:`, data);
        stateSetter([]); // Защищаем .map() от падения
      }
    } catch (err) {
      console.error(`[${errorLabel}] Ошибка сети:`, err);
      stateSetter([]);
    }
  };

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
        setSelectedContract(null);
        setIsContractModalOpen(true);
        break;
      case 'staff':
        setSelectedStaff(null);
        setIsStaffModalOpen(true);
        break;
      case 'service-stations':
        setSelectedStation(null);
        setIsStationModalOpen(true);
        break;
      case 'service-catalog':
        setSelectedCatalogService(null);
        setIsServiceCatalogModalOpen(true);
        break;
      default:
        console.warn(`Нет обработчика создания для вкладки: ${activeTab}`);
        break;
    }
  };

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      //запрос на удаление httpOnly куки
      await apiFetch('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Ошибка при выходе на сервере:', error);
    } finally {

      setCurrentUser(null);

      window.location.reload();
    }
  };

  const loadClients = () => loadDataArray('/clients', setClients, 'Клиенты');
  const loadCars = () => loadDataArray('/cars', setCars, 'Авто');
  const loadApplications = () => loadDataArray('/applications', setApplications, 'Заявки');
  const loadVendors = () => loadDataArray('/logistics/vendors', setVendors, 'Поставщики');
  const loadContracts = () => loadDataArray('/logistics/partscontracts', setContracts, 'Договоры');
  const loadStations = () => loadDataArray('/logistics/stations', setStations, 'Филиалы');
  const loadServices = () => loadDataArray('/catalog', setServices, 'Каталог услуг');

  const loadOrders = () => {
    apiFetch('/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        if (data.meta && data.meta.statuses) {
          setStatuses(data.meta.statuses);
        }
      })
      .catch(err => console.error('Ошибка загрузки ЗН:', err));
  };

  const loadStaff = () => {
    apiFetch('/staff')
      .then(res => res.json())
      .then(data => {
        setStaff(data.staff);
        setStaffMeta(data.meta);
      })
      .catch(err => console.error('Ошибка сотрудников:', err));
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
    if (currentUser) {
      loadClients();
      loadCars();
      loadApplications();
      loadVendors();
      loadContracts();
      loadStaff();
      loadStations();
      loadServices();
      loadOrders();
    }
  }, [currentUser]);

  return (
    <div className="app-container">
      {!currentUser ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          <main className="content">
            <Header
              activeTab={activeTab}
              currentUser={currentUser}
              onOpenModal={handleOpenPrimaryModal}
            />
            <section id="view-container">
              {activeTab === 'dashboard' && (
                <Dashboard
                  currentUser={currentUser}
                  clients={clients}
                  cars={cars}
                  applications={applications}
                  orders={orders}
                />
              )}

              {activeTab === 'work-orders' && (
                <WorkOrderTable
                  orders={orders}
                  userRole={currentUser.role}
                  onEdit={(order) => {
                    setSelectedOrderId(order.order_id);
                    setIsDetailsOpen(true);
                  }}
                  onViewApplication={(appId) => {
                    const app = applications.find(a => Number(a.id) === Number(appId));
                    setViewingApplication(app);
                    setIsAppViewOpen(true);
                  }}
                />
              )}

              {activeTab === 'clients' && (
                <ClientsTable
                  clients={clients}
                  userRole={currentUser.role}
                  onEdit={(client) => {
                    setSelectedClient(client);
                    setIsClientModalOpen(true);
                  }}
                />
              )}

              {activeTab === 'cars' && (
                <CarTable
                  cars={cars}
                  userRole={currentUser.role}
                  onEdit={(car) => {
                    setSelectedCar(car);
                    setIsCarModalOpen(true);
                  }}
                />
              )}

              {activeTab === 'applications' && (
                <ApplicationTable
                  applications={applications}
                  userRole={currentUser.role}
                  onEdit={(app) => {
                    setSelectedApplication(app);
                    setIsAppModalOpen(true);
                  }}
                />
              )}
              {activeTab === 'staff' && (
                <StaffTable
                  staff={staff}
                  userRole={currentUser.role}
                  onEdit={(employee) => {
                    setSelectedStaff(employee);
                    setIsStaffModalOpen(true);
                  }}
                />
              )}
              {activeTab === 'service-stations' && (
                <ServiceStationsTable
                  stations={stations}
                  userRole={currentUser.role}
                  onEdit={(st) => {
                    setSelectedStation(st);
                    setIsStationModalOpen(true);
                  }}
                />
              )}
              {activeTab === 'service-catalog' && (
                <ServiceTable
                  services={services}
                  userRole={currentUser.role}
                  onEdit={(s) => {
                    setSelectedCatalogService(s);
                    setIsServiceCatalogModalOpen(true);
                  }}
                />
              )}
              {activeTab === 'vendors' && (
                <VendorsTable
                  vendors={vendors}
                  userRole={currentUser.role}
                  onEdit={(v) => {
                    setSelectedVendor(v);
                    setIsVendorModalOpen(true);
                  }}
                />
              )}
              {activeTab === 'contracts' && (
                <PartsContractsTable
                  contracts={contracts}
                  onRefresh={loadContracts}
                  userRole={currentUser.role}
                  onEdit={(contract) => {
                    setSelectedContract(contract);
                    setIsContractModalOpen(true);
                  }}
                />
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
            onClose={() => {
              setIsContractModalOpen(false);
              setSelectedContract(null);
            }}
            onRefresh={loadContracts}
            vendors={vendors}
            contractToEdit={selectedContract}
          />
          <StaffModal
            isOpen={isStaffModalOpen}
            onClose={() => setIsStaffModalOpen(false)}
            onRefresh={loadStaff}
            staffToEdit={selectedStaff}
            meta={staffMeta}
          />
          <StationModal
            isOpen={isStationModalOpen}
            onClose={() => setIsStationModalOpen(false)}
            onRefresh={loadStations}
            stationToEdit={selectedStation}
          />
          <ServiceCatalogModal
            isOpen={isServiceCatalogModalOpen}
            onClose={() => setIsServiceCatalogModalOpen(false)}
            onRefresh={loadServices}
            serviceToEdit={selectedCatalogService}
          />
          <ApplicationInfoModal
            isOpen={isAppViewOpen}
            onClose={() => {
              setIsAppViewOpen(false);
              setViewingApplication(null);
            }}
            application={viewingApplication}
          />
        </>
      )}
    </div>
  );
}

export default App;