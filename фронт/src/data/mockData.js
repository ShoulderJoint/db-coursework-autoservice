// Имитация данных (позже заменим на запросы к Node.js + PostgreSQL)

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Рабочий стол', roles: ['root', 'admin', 'advisor', 'client'] },
  { id: 'work-orders', label: 'Заказ-наряды', roles: ['root', 'admin', 'advisor', 'client'] },
  { id: 'applications', label: 'Заявки', roles: ['root', 'admin', 'advisor', 'client'] },
  { id: 'clients', label: 'База клиентов', roles: ['root', 'admin'] }, // МП убрали
  { id: 'cars', label: 'Автопарк', roles: ['root', 'admin', 'client'] }, // Клиент видит свои
  { id: 'staff', label: 'Персонал', roles: ['root'] }, //
  { id: 'service-stations', label: 'Филиалы', roles: ['root', 'advisor'] },
  { id: 'service-catalog', label: 'Каталог услуг', roles: ['root', 'admin', 'advisor', 'client'] },
  { id: 'vendors', label: 'Поставщики', roles: ['root', 'advisor'] },
  { id: 'contracts', label: 'Договоры', roles: ['root', 'admin', 'advisor'] }
];

export const MOCK_SYSTEM_ROLES = [
  { id: 1, system_name: 'root', display_name: 'Владелец' },
  { id: 2, system_name: 'admin', display_name: 'Администратор' },
  { id: 3, system_name: 'advisor', display_name: 'Мастер-приемщик' },
  { id: 4, system_name: 'client', display_name: 'Клиент' },
];

export const MOCK_ROLES = [
  { id: 1, name: "Директор" }, 
  { id: 2, name: "Администратор" },
  { id: 3, name: "Мастер-приёмщик" },
  { id: 4, name: "Слесарь" },
  { id: 5, name: "Диагност" },
];

export const MOCK_CLIENTS = [
  { id: 1, surname: "Шумахер", name: "Михаэль", patronymic: "Рольфович", phone: "+79771234567", login: "user", password_hash: "hash123", system_role_id: 4 },
  { id: 2, surname: "Ферстаппен", name: "Макс", patronymic: "Йосович", phone: "+79123456700", login: "user1", password_hash: "hash123", system_role_id: 4 },
  { id: 3, surname: "Хэмилтон", name: "Льюис", patronymic: null, phone: "+79864456712", login: "user2", password_hash: "hash123", system_role_id: 4},
  { id: 4, surname: "Сенна", name: "Айртон", patronymic: "Милтонович", phone: null, login: "user3", password_hash: "hash123", system_role_id: 4},
  { id: 5, surname: "Лауда", name: "Николаус", patronymic: "Петрович", phone: null, login: "user4", password_hash: "hash123", system_role_id: 4},
  { id: 6, surname: "Антонелли", name: "Кими", patronymic: "Маркович", phone: "+79823579235", login: "user5", password_hash: "hash123", system_role_id: 4 }
];

export const MOCK_CARS = [
  { id: 1, client_id: 1, brand: "Mercedes-Benz", model: "W124", production_year: 1987, vin: "WDB1240201A123456", reg_number: "А777МР 77" },
  { id: 2, client_id: 1, brand: "Renault", model: "Logan", production_year: 2012, vin: "X7LLSRGALH1234567", reg_number: "К123ОТ 150" },
  { id: 3, client_id: 2, brand: "Lada", model: "Vesta", production_year: 2021, vin: "XTA218000M1234567", reg_number: "Е555КХ 197" },
  { id: 4, client_id: 3, brand: "Lada", model: "Kalina", production_year: 2014, vin: "XTA111760E1234567", reg_number: "М890УЕ 750" },
  { id: 5, client_id: 6, brand: "Nissan", model: "Qashqai (J10)", production_year: 2010, vin: "SJNFAAJ10U1234567", reg_number: "В444СС 799" },
  { id: 6, client_id: 5, brand: "Lada", model: "Priora", production_year: 2015, vin: "XTA217030F1234567", reg_number: "Н001НН 05" },
  { id: 7, client_id: 4, brand: "Tank", model: "300", production_year: 2023, vin: "X96TANK300P123456", reg_number: "Р111АА 777" },
  { id: 8, client_id: 4, brand: "Tank", model: "300", production_year: 2024, vin: "X96TANK300R123456", reg_number: "С222ВВ 777" },
  { id: 9, client_id: 1, brand: "Changan", model: "Alsvin", production_year: 2023, vin: "LSYC11E40P1234567", reg_number: "Х321КМ 790" },
  { id: 10, client_id: 3, brand: "Haval", model: "Jolion", production_year: 2022, vin: "X9FCH4A12N1234567", reg_number: "Т999ММ 199" },
  { id: 11, client_id: 6, brand: "Toyota", model: "Mark II (JZX100)", production_year: 1999, vin: "JZX100-6012345", reg_number: "К888ОК 125" }
];

export const MOCK_APPLICATIONS= [
  { id: 1, car_id: 4, staff_id: 3, description: "Нужно заменить моторное масло и заправить кондиционер", created_at: "24.04.2026", updated_at: null },
  { id: 2, car_id: 3, staff_id: 6, description: "Шум и скрип в подвеске", created_at: "10.02.2020", updated_at: null},
  { id: 3, car_id: 7, staff_id: 7, description: "Повышенный расход масла и топлива", created_at: "11.05.2022", updated_at: "12.05.2022" },
  { id: 4, car_id: 11, staff_id: 6, description: "Горит check engine", created_at: "07.11.2019", updated_at: null },
  { id: 5, car_id: 2, staff_id: 7, description: "Поменять шины на передних колёсах", created_at: "08.11.2025", updated_at: "08.11.2025" },
  { id: 6, car_id: 3, staff_id: 3, description: "Замена воздушных и салонных фильтров", created_at: "01.09.2023", updated_at: null },
];

export const MOCK_STATIONS = [
  { id: 1, region: "Самарская область", city: "Самара", street: "Академика Павлова", house: "1", phone: "+74950001122" },
  { id: 2, region: "Самарская область", city: "Тольятти", street: "Комсомольская", house: "44", phone: "+74950003344" }
];

export const MOCK_ORDER_STATUSES = [
  { id: 1, name: "Создан", description: "Все проблемы обсуждены, ожидается место для автомобиля" },
  { id: 2, name: "В работе", description: "Заказ-наряд принят, ведутся работы" },
  { id: 3, name: "В_ожидании", description: "Работы над Заказ-нарядом приостановлены" },
  { id: 4, name: "Авто_готово_к_выдаче", description: "Все работы завершены и оплачены, клиент может забирать автомобиль" },
  { id: 5, name: "Отменён", description: "Заказ-наряд отменён по требованию клиента или невозможности его выполнения" },
  { id: 6, name: "Завершён", description: "Работы завершены и оплачены, автомобиль выдан" }
];

export const MOCK_SERVICES = [
  { id: 1, name: "Замена масла", price: 1000 },
  { id: 2, name: "Диагностика ходовой", price: 1500 },
  { id: 3, name: "Шиномонтаж", price: 2000 },
  { id: 4, name: "Развал-схождение", price: 2500 }
];

export const MOCK_STAFF = [
  { 
    id: 1, station_id: 1, surname: "Иванов", name: "Иван", patronymic: "Иванович", 
    role_id: 3, login: "ivanov_mp", password_hash: "hash123", system_role_id: 3 
  }, // Мастер-приемщик
  { 
    id: 2, station_id: 1, surname: "Петров", name: "Петр", patronymic: null, 
    role_id: 4, login: null, password_hash: null, system_role_id: null 
  }, // Слесарь (без доступа)
  { 
    id: 3, station_id: 1, surname: "Сидоров", name: "Сидор", patronymic: "Сидорович", 
    role_id: 2, login: "admin", password_hash: "123", system_role_id: 2 
  }, // Администратор
  { 
    id: 4, station_id: 2, surname: "Шишкина", name: "Евгения", patronymic: "Олеговна", 
    role_id: 4, login: null, password_hash: null, system_role_id: null 
  }, // Слесарь (без доступа)
  { 
    id: 5, station_id: 2, surname: "Литин", name: "Кирилл", patronymic: "Артёмович", 
    role_id: 5, login: null, password_hash: null, system_role_id: null 
  }, // Диагност (без доступа)
  { 
    id: 6, station_id: 2, surname: "Ленин", name: "Петр", patronymic: null, 
    role_id: 2, login: "lenin_admin", password_hash: "123", system_role_id: 2 
  }, // Администратор
  { 
    id: 7, station_id: 1, surname: "Лобанов", name: "Сергей", patronymic: "Петрович", 
    role_id: 2, login: "lobanov_tech", password_hash: "123", system_role_id: 2 
  }, // Администратор
  { 
    id: 8, station_id: 2, surname: "Быкова", name: "Валерия", patronymic: "Петровна", 
    role_id: 3, login: "master", password_hash: "123", system_role_id: 3 
  }, // Мастер-приемщик
  { 
    id: 9, station_id: 1, surname: "Кабанов", name: "Кабан", patronymic: "Кабаныч", 
    role_id: 1, login: "root", password_hash: "123", system_role_id: 1 
  }  // Владелец
];

export const MOCK_VENDORS = [
  { id: 1, name: "АвтоМир Запчасти", region: "Московская область", city: "Москва", street: "Южнопортовая", house: "7", office_flat: "оф 12", postcode: "115114", TIN: "7712345678", phone_number: "+74951112233" },
  { id: 2, name: "АвтоВселенная Запчасти", region: "Ленинградская область", city: "Санкт-Петербург", street: "Невский проспект", house: "13/37", office_flat: null, postcode: "191023", TIN: "7787654321", phone_number: "+74828889521" }
];

export const MOCK_WORK_ORDERS = [
  { id: 1, application_id: 1, service_advisor_id: 1, status_id: 1, service_station_id: 1, close_date: null },
  { id: 2, application_id: 2, service_advisor_id: 8, status_id: 1, service_station_id: 2, close_date: null },
  { id: 3, application_id: 4, service_advisor_id: 8, status_id: 2, service_station_id: 2, close_date: "10.11.2019" },
  { id: 4, application_id: 5, service_advisor_id: 1, status_id: 3, service_station_id: 1, close_date: "09.11.2025" },
  { id: 5, application_id: 6, service_advisor_id: 1, status_id: 2, service_station_id: 1, close_date: "15.09.2023" },
  { id: 6, application_id: 3, service_advisor_id: 1, status_id: 1, service_station_id: 1, close_date: null },
];

export const MOCK_SPARE_PARTS_CONTRACTS = [
  { id: 1, vendor_id: 1, date: "15.03.2026", total_price: 15200 },
  { id: 2, vendor_id: 2, date: "10.04.2024", total_price: 45000 },
  { id: 3, vendor_id: 1, date: "11.11.2025", total_price: 8900 }
];

//промежуточные
export const MOCK_WORK_ORDER_SERVICES = [
  { id: 1, work_order_id: 1, service_id: 1, count: 1, applied_price: 1000, coeff: 1.0 },
  { id: 2, work_order_id: 1, service_id: 2, count: 1, applied_price: 1500, coeff: 1.0 },
  { id: 3, work_order_id: 2, service_id: 2, count: 1, applied_price: 1500, coeff: 1.2 }, // Коэф. за сложность
  { id: 4, work_order_id: 3, service_id: 4, count: 1, applied_price: 2500, coeff: 1.0 },
  { id: 5, work_order_id: 4, service_id: 3, count: 4, applied_price: 2000, coeff: 1.0 },
  { id: 6, work_order_id: 5, service_id: 1, count: 1, applied_price: 1000, coeff: 1.1 },
  { id: 7, work_order_id: 6, service_id: 2, count: 1, applied_price: 1500, coeff: 1.5 },
];

export const MOCK_WORK_ORDER_SPARE_PARTS = [
  { id: 1, work_order_id: 1, spare_part_id: 101, count: 1, applied_price: 850 },  // Фильтр
  { id: 2, work_order_id: 1, spare_part_id: 102, count: 4, applied_price: 3200 }, // Масло
  { id: 3, work_order_id: 2, spare_part_id: 103, count: 2, applied_price: 4500 }, // Рычаги
  { id: 4, work_order_id: 3, spare_part_id: 104, count: 2, applied_price: 1200 }, // Тяги
  { id: 5, work_order_id: 5, spare_part_id: 101, count: 1, applied_price: 950 },
  { id: 6, work_order_id: 6, spare_part_id: 105, count: 1, applied_price: 12000 }, // Дорогая деталь
];

export const MOCK_SPARE_PARTS_CONTRACT_ITEMS = [
  { id: 1, contract_id: 1, name: "Фильтр масляный Mann", count: 10 },
  { id: 2, contract_id: 1, name: "Фильтр воздушный", count: 5 },
  { id: 3, contract_id: 2, name: "Комплект ГРМ Vesta", count: 3 },
  { id: 4, contract_id: 2, name: "Стойки амортизатора", count: 4 },
  { id: 5, contract_id: 2, name: "Тормозные диски Brembo", count: 2 },
  { id: 6, contract_id: 3, name: "Жидкость ГУР 1л", count: 6 },
  { id: 7, contract_id: 3, name: "Свечи зажигания NGK", count: 20 }
];