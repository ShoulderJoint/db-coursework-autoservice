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

export const MOCK_ROLES = [
  { id: 1, system_name: 'root', display_name: 'Владелец' },
  { id: 2, system_name: 'admin', display_name: 'Администратор' },
  { id: 3, system_name: 'advisor', display_name: 'Мастер-приемщик' },
  { id: 4, system_name: 'client', display_name: 'Клиент' },
];

export const MOCK_ACCOUNTS = [
  { id: 1, login: 'root', password: '123', role_id: 1, staff_id: 1, client_id: null },
  { id: 2, login: 'admin', password: '123', role_id: 2, staff_id: 3, client_id: null },
  { id: 3, login: 'master', password: '123', role_id: 3, staff_id: 8, client_id: null },
  { id: 4, login: 'user', password: '123', role_id: 4, staff_id: null, client_id: 1 }, // Ссылка на Михуэля Шумахера
  { id: 5, login: 'user1', password: '123', role_id: 4, staff_id: null, client_id: 2 }, //макс
  { id: 6, login: 'user2', password: '123', role_id: 4, staff_id: null, client_id: 3 } //льюис
];

export const MOCK_JOB_TITLES = [
  { id: 1, name: "Директор" }, 
  { id: 2, name: "Администратор" },
  { id: 3, name: "Мастер-приёмщик" },
  { id: 4, name: "Слесарь Механосборочных работ" },
  { id: 5, name: "Диагност-электрик" },
];

export const MOCK_CLIENTS = [
  { id: 1, surname: "Шумахер", name: "Михаэль", patronymic: "Рольфович", phone: "+79771234567" },
  { id: 2, surname: "Ферстаппен", name: "Макс", patronymic: "Йосович", phone: "+79123456700" },
  { id: 3, surname: "Хэмилтон", name: "Льюис", patronymic: null, phone: "+79864456712" },
  { id: 4, surname: "Сенна", name: "Айртон", patronymic: "Милтонович", phone: null },
  { id: 5, surname: "Лауда", name: "Николаус", patronymic: "Петрович", phone: null },
  { id: 6, surname: "Антонелли", name: "Кими", patronymic: "Маркович", phone: "+79823579235" }
];

export const MOCK_CARS = [
  { id: 1, owner_id: 1, brand: "Mercedes-Benz", model: "W124", production_year: 1987, vin: "WDB1240201A123456", license_plate: "А777МР 77" },
  { id: 2, owner_id: 1, brand: "Renault", model: "Logan", production_year: 2012, vin: "X7LLSRGALH1234567", license_plate: "К123ОТ 150" },
  { id: 3, owner_id: 2, brand: "Lada", model: "Vesta", production_year: 2021, vin: "XTA218000M1234567", license_plate: "Е555КХ 197" },
  { id: 4, owner_id: 3, brand: "Lada", model: "Kalina", production_year: 2014, vin: "XTA111760E1234567", license_plate: "М890УЕ 750" },
  { id: 5, owner_id: 6, brand: "Nissan", model: "Qashqai (J10)", production_year: 2010, vin: "SJNFAAJ10U1234567", license_plate: "В444СС 799" },
  { id: 6, owner_id: 5, brand: "Lada", model: "Priora", production_year: 2015, vin: "XTA217030F1234567", license_plate: "Н001НН 05" },
  { id: 7, owner_id: 4, brand: "Tank", model: "300", production_year: 2023, vin: "X96TANK300P123456", license_plate: "Р111АА 777" },
  { id: 8, owner_id: 4, brand: "Tank", model: "300", production_year: 2024, vin: "X96TANK300R123456", license_plate: "С222ВВ 777" },
  { id: 9, owner_id: 1, brand: "Changan", model: "Alsvin", production_year: 2023, vin: "LSYC11E40P1234567", license_plate: "Х321КМ 790" },
  { id: 10, owner_id: 3, brand: "Haval", model: "Jolion", production_year: 2022, vin: "X9FCH4A12N1234567", license_plate: "Т999ММ 199" },
  { id: 11, owner_id: 6, brand: "Toyota", model: "Mark II (JZX100)", production_year: 1999, vin: "JZX100-6012345", license_plate: "К888ОК 125" }
];

export const MOCK_APPLICATION = [
  { id: 1, car_id: 4, administrator_id: 3, troubles_description: "Нужно заменить моторное масло и заправить кондиционер", registration_date: "24.04.2026" },
  { id: 2, car_id: 3, administrator_id: 6, troubles_description: "Шум и скрип в подвеске", registration_date: "10.02.2020" },
  { id: 3, car_id: 7, administrator_id: 7, troubles_description: "Повышенный расход масла и топлива", registration_date: "11.05.2022" },
  { id: 4, car_id: 11, administrator_id: 6, troubles_description: "Горит check engine", registration_date: "07.11.2019" },
  { id: 5, car_id: 2, administrator_id: 7, troubles_description: "Поменять шины на передних колёсах", registration_date: "08.11.2025" },
  { id: 6, car_id: 3, administrator_id: 3, troubles_description: "Замена воздушных и салонных фильтров", registration_date: "01.09.2023" },
];

export const MOCK_SERVICE_STATIONS = [
  { id: 1, region: "Самарская область", city: "Самара", street: "Академика Павлова", house: "1", phone_number: "+74950001122" },
  { id: 2, region: "Самарская область", city: "Тольятти", street: "Комсомольская", house: "44", phone_number: "+74950003344" }
];

export const MOCK_STATUSES = [
  { id: 1, name: "В работе", description: "Заказ-наряд принят, ведутся работы" },
  { id: 2, name: "Завершен", description: "Работы завершены, автомобиль выдан" },
  { id: 3, name: "Отменен", description: "Заказ-наряд отменён по требованию клиента или невозможности его выполнения" },
  { id: 4, name: "В ожидании комплектующих", description: "Работы приостановлены до момента получения нужны комплектующих" },
  { id: 5, name: "В ожидании оплаты", description: "Все работы завершены, ожидается оплата" },
  { id: 6, name: "Авто готово к выдаче", description: "Все работы завершены и оплачены, клиент может забирать автомобиль" }
];

export const MOCK_SERVICES = [
  { id: 1, name: "Замена масла", price: 1000 },
  { id: 2, name: "Диагностика ходовой", price: 1500 },
  { id: 3, name: "Шиномонтаж", price: 2000 },
  { id: 4, name: "Развал-схождение", price: 2500 }
];

export const MOCK_STAFF = [
  { id: 1, service_station_id: 1, surname: "Иванов", name: "Иван", patronymic: "Иванович", job_id: 3},
  { id: 2, service_station_id: 1, surname: "Петров", name: "Петр", patronymic: null, job_id: 4 },
  { id: 3, service_station_id: 1, surname: "Сидоров", name: "Сидор", patronymic: "Сидорович", job_id: 2 },
  { id: 4, service_station_id: 2, surname: "Шишкина", name: "Евгения", patronymic: "Олеговна", job_id: 4 },
  { id: 5, service_station_id: 2, surname: "Литин", name: "Кирилл", patronymic: "Артёмович", job_id: 5 },
  { id: 6, service_station_id: 2, surname: "Ленин", name: "Петр", patronymic: null, job_id: 2 },
  { id: 7, service_station_id: 1, surname: "Лобанов", name: "Сергей", patronymic: "Петрович", job_id: 2 },
  { id: 8, service_station_id: 2, surname: "Быкова", name: "Валерия", patronymic: "Петровна", job_id: 3 },
  { id: 9, service_station_id: 1, surname: "Кабанов", name: "Кабан", patronymic: "Кабаныч", job_id: 1 }
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