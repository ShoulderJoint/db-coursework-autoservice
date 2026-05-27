import React from 'react';

const LandingPage = ({ onLoginClick }) => {
  // Список популярных услуг для вывода на главную
  const popularServices = [
    { title: 'Регулярное ТО', desc: 'Замена масла, фильтров, свечей и комплексная проверка всех систем автомобиля.', price: 'от 2 500 руб.' },
    { title: 'Ремонт ходовой части', desc: 'Диагностика подвески, замена амортизаторов, сайлентблоков и рычагов.', price: 'от 1 800 руб.' },
    { title: 'Компьютерная диагностика', desc: 'Чтение и сброс ошибок, проверка работы датчиков и электронных блоков.', price: '1 000 руб.' },
    { title: 'Ремонт тормозной системы', desc: 'Замена тормозных колодок, дисков, суппортов и тормозной жидкости.', price: 'от 1 200 руб.' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-layout">
      {/* Шапка сайта */}
      <header className="landing-header">
        <div className="landing-logo" onClick={() => scrollToSection('hero')}>
          <span className="logo-icon">⚙️</span>
          <span className="logo-text">СТО Система</span>
        </div>
        
        <nav className="landing-nav">
          <button onClick={() => scrollToSection('services')} className="nav-link-btn">Услуги</button>
          <button onClick={() => scrollToSection('contacts')} className="nav-link-btn">Контакты</button>
        </nav>

        <button className="btn-primary" onClick={onLoginClick}>
          Личный кабинет
        </button>
      </header>

      {/* Главный баннер (Hero Section) */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <h1>Профессиональный ремонт и обслуживание автомобилей</h1>
          <p>Сеть современных сервисных центров с гарантией на все виды работ. Прозрачное ценообразование и опытные мастера.</p>
          <button className="btn-hero" onClick={() => scrollToSection('services')}>Посмотреть услуги</button>
        </div>
      </section>

      {/* Секция услуг */}
      <section id="services" className="landing-section">
        <h2 className="section-title">Наши услуги</h2>
        <div className="services-landing-grid">
          {popularServices.map((service, index) => (
            <div key={index} className="service-landing-card">
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <div className="service-card-price">{service.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Секция контактов */}
      <section id="contacts" className="landing-section bg-alt">
        <h2 className="section-title">Контакты и филиалы</h2>
        <div className="contacts-landing-grid">
          <div className="contact-info-block">
            <h3>Центральный офис</h3>
            <p><strong>Телефон:</strong> +7 (846) 123-45-67</p>
            <p><strong>Email:</strong> info@sto-sistema.ru</p>
            <p><strong>Режим работы:</strong> Ежедневно с 09:00 до 21:00</p>
          </div>
          <div className="contact-info-block">
            <h3>Наши точки в Самаре</h3>
            <ul>
              <li>ул. Московское шоссе, д. 64</li>
              <li>ул. Ново-Садовая, д. 106</li>
              <li>ул. Победы, д. 14</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Подвал */}
      <footer className="landing-footer">
        <p>&copy; 2026 СТО Система. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default LandingPage;