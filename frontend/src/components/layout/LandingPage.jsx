import React, { useState } from 'react';
import stoPic from '../../assets/sto_pic.jpeg';

const LandingPage = ({ onLoginClick, services, stations }) => {

  const [view, setView] = useState('home');
  const [selectedService, setSelectedService] = useState(null);

  const [selectedStation, setSelectedStation] = useState(null);

  const [isConsentGiven, setIsConsentGiven] = useState(false);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    comment: ''
  });

  const [isContactsOpen, setIsContactsOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAboutClick = () => {
    if (view !== 'home' || selectedService) {
      setSelectedService(null);
      setView('home');
      setTimeout(() => scrollToSection('about'), 100);
    } else {
      scrollToSection('about');
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStation) {
      alert('Пожалуйста, выберите филиал в шапке сайта перед отправкой заявки.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/applications/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestData,
          service_name: selectedService ? selectedService.name : null,
          station_id: selectedStation
        })
      });

      if (response.ok) {
        alert('Заявка успешно отправлена! Ожидайте звонка администратора.');
        setIsRequestModalOpen(false);
        setRequestData({ name: '', surname: '', phone: '', email: '', brand: '', model: '', comment: '' });
        setIsConsentGiven(false);
      } else {
        alert('Ошибка при отправке заявки');
      }
    } catch (error) {
      alert('Ошибка сети при попытке отправить заявку');
    }
  };

  // Общая разметка модального окна
  const requestModalContent = isRequestModalOpen && (
    <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '450px' }}>
        <h2 style={{ marginTop: 0 }}>Оставить заявку</h2>
        {selectedService && (
          <p style={{ color: '#64748b', marginBottom: '15px' }}>Услуга: <strong>{selectedService.name}</strong></p>
        )}
        {selectedStation && stations && (
          <p style={{ color: '#64748b', marginBottom: '15px' }}>
            Филиал: <strong>г. {stations.find(s => s.id === selectedStation)?.city}, ул. {stations.find(s => s.id === selectedStation)?.street},
              {stations.find(s => s.id === selectedStation)?.house}</strong>
          </p>
        )}
        {!selectedStation && (
          <p style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>
            * Необходимо выбрать филиал в шапке сайта.
          </p>
        )}
        <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Имя" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={requestData.name} onChange={e => setRequestData({ ...requestData, name: e.target.value })} />
            <input placeholder="Фамилия" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={requestData.surname} onChange={e => setRequestData({ ...requestData, surname: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Телефон" maxLength="12" required type="tel" style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={requestData.phone} onChange={e => setRequestData({ ...requestData, phone: e.target.value })} />
            <input placeholder="Email" required type="email" style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={requestData.email} onChange={e => setRequestData({ ...requestData, email: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Марка авто (напр. Kia)" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={requestData.brand} onChange={e => setRequestData({ ...requestData, brand: e.target.value })} />
            <input placeholder="Модель (напр. Rio)" required style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={requestData.model} onChange={e => setRequestData({ ...requestData, model: e.target.value })} />
          </div>

          <textarea placeholder="Опишите проблему или пожелания" rows="3" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            value={requestData.comment} onChange={e => setRequestData({ ...requestData, comment: e.target.value })} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '10px', marginBottom: '10px' }}>
            <input
              type="checkbox"
              id="consent"
              required
              checked={isConsentGiven}
              onChange={(e) => setIsConsentGiven(e.target.checked)}
              style={{ marginTop: '4px', cursor: 'pointer' }}
            />
            <label htmlFor="consent" style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer', lineHeight: '1.4' }}>
              Даю согласие на обработку моих персональных данных
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setIsRequestModalOpen(false)} className="btn-secondary">Отмена</button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!isConsentGiven}
              style={{
                opacity: isConsentGiven ? 1 : 0.5,
                cursor: isConsentGiven ? 'pointer' : 'not-allowed'
              }}
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const HeaderActions = () => (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsContactsOpen(!isContactsOpen)}
          className="btn-secondary"
          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Филиалы {isContactsOpen ? '▲' : '▼'}
        </button>

        {isContactsOpen && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '280px',
            background: '#fff', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0', zIndex: 50
          }}>
            {stations && stations.length > 0 ? (
              stations.map((st) => (
                <div
                  key={st.id}
                  onClick={() => {
                    setSelectedStation(st.id);
                    setIsContactsOpen(false); // Закрываем список после выбора
                  }}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    backgroundColor: selectedStation === st.id ? '#e2e8f0' : '#fff', // Подсветка выбранного
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedStation === st.id ? '#e2e8f0' : '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedStation === st.id ? '#e2e8f0' : '#fff'}
                >
                  <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                    г. {st.city}, ул. {st.street}, д. {st.house}
                  </div>
                  <div style={{ color: '#000000', fontSize: '14px', fontWeight: '500' }}>
                    {st.phone || 'Телефон не указан'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '12px 16px', color: '#64748b' }}>Загрузка филиалов...</div>
            )}
          </div>
        )}
      </div>

      <button className="btn-secondary" style={{ background: 'transparent', border: '2px solid #2563eb', color: '#2563eb', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setIsRequestModalOpen(true)}>
        Оставить заявку
      </button>

      <button className="btn-primary" onClick={onLoginClick}>
        Личный кабинет
      </button>
    </div>
  );

  // ==========================================
  // 1. ДЕТАЛЬНАЯ СТРАНИЦА КОНКРЕТНОЙ УСЛУГИ
  // ==========================================
  if (selectedService) {
    return (
      <div className="landing-layout">
        <header className="landing-header">
          <div className="landing-logo" onClick={() => { setSelectedService(null); setView('home'); }}>
            <span className="logo-text">СТО Система</span>
          </div>
          <nav className="landing-nav">
            <button onClick={() => { setSelectedService(null); setView('catalog'); }} className="nav-link-btn">Услуги</button>
            <button onClick={handleAboutClick} className="nav-link-btn">О нас</button>
          </nav>
          <HeaderActions />
        </header>

        <section className="landing-section" style={{ minHeight: '60vh', marginTop: '20px' }}>
          <button
            onClick={() => setSelectedService(null)}
            className="btn-secondary"
            style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
          >
            ← Назад к списку
          </button>

          <div className="service-page-content" style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '15px', color: '#0f172a' }}>{selectedService.name}</h1>

            <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb', marginBottom: '25px' }}>
              Стоимость: {selectedService.price || selectedService.cost ? `${selectedService.price || selectedService.cost} руб.` : 'По запросу'}
            </div>

            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#1e293b' }}>Описание услуги</h3>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', maxWidth: '800px', marginBottom: '30px' }}>
              {selectedService.description || 'Подробное описание услуги находится в процессе наполнения. Наша сеть СТО гарантирует высокое качество выполнения данной работы с использованием профессионального оборудования и сертифицированных расходных материалов.'}
            </p>

            <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '16px' }} onClick={() => setIsRequestModalOpen(true)}>
              Оставить заявку
            </button>
          </div>
        </section>

        <footer className="landing-footer">
          <p>&copy; 2026 СТО Система. Все права защищены.</p>
        </footer>
        {requestModalContent}
      </div>
    );
  }

  // ==========================================
  // 2. СТРАНИЦА КАТАЛОГА ВСЕХ УСЛУГ
  // ==========================================
  if (view === 'catalog') {
    return (
      <div className="landing-layout">
        <header className="landing-header">
          <div className="landing-logo" onClick={() => setView('home')}>
            <span className="logo-text">СТО Система</span>
          </div>

          <nav className="landing-nav">
            <button onClick={() => setView('catalog')} className="nav-link-btn" style={{ color: '#2563eb' }}>Услуги</button>
            <button onClick={handleAboutClick} className="nav-link-btn">О нас</button>
          </nav>

          <HeaderActions />
        </header>

        <section className="landing-section" style={{ minHeight: '60vh', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', color: '#0f172a', margin: 0 }}>Полный каталог услуг</h1>
            <button
              onClick={() => setView('home')}
              className="btn-secondary"
              style={{ cursor: 'pointer', padding: '8px 16px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
            >
              ← На главную
            </button>
          </div>

          <div className="services-landing-grid">
            {services && services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="service-landing-card"
                  onClick={() => setSelectedService(service)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                  }}
                >
                  <h3>{service.name}</h3>
                  <p>{service.description ? (service.description.slice(0, 100) + '...') : 'Нажмите, чтобы узнать подробнее об услуге...'}</p>
                  <div className="service-card-price">
                    {service.price || service.cost ? `${service.price || service.cost} руб.` : 'По запросу'}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b', gridColumn: '1/-1' }}>Каталог пуст или загружается...</p>
            )}
          </div>
        </section>

        <footer className="landing-footer">
          <p>&copy; 2026 СТО Система. Все права защищены.</p>
        </footer>
        {requestModalContent}
      </div>
    );
  }

  // ==========================================
  // 3. ГЛАВНАЯ СТРАНИЦА (ЛЕНДИНГ)
  // ==========================================
  return (
    <div className="landing-layout">
      <header className="landing-header">
        <div className="landing-logo" onClick={() => scrollToSection('hero')}>
          <span className="logo-text">СТО Система</span>
        </div>

        <nav className="landing-nav">
          <button onClick={() => setView('catalog')} className="nav-link-btn">Услуги</button>
          <button onClick={() => scrollToSection('about')} className="nav-link-btn">О нас</button>
        </nav>

        <HeaderActions />
      </header>

      <section id="hero" className="hero-section">
        <div className="hero-content">
          <h1>Профессиональный ремонт и обслуживание автомобилей</h1>
          <p>Сеть современных сервисных центров с гарантией на все виды работ. Прозрачное ценообразование и опытные мастера.</p>
          <button className="btn-hero" onClick={() => setView('catalog')}>Посмотреть каталог услуг</button>
        </div>
      </section>

      <section id="services" className="landing-section">
        <h2 className="section-title">Популярные услуги</h2>
        <div className="services-landing-grid">
          {services && services.length > 0 ? (
            services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="service-landing-card"
                onClick={() => setSelectedService(service)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                }}
              >
                <h3>{service.name}</h3>
                <p>{service.description ? (service.description.slice(0, 100) + '...') : 'Нажмите, чтобы узнать подробнее об услуге, сроках выполнения и гарантии.'}</p>
                <div className="service-card-price">
                  {service.price || service.cost ? `${service.price || service.cost} руб.` : 'По запросу'}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b', gridColumn: '1/-1' }}>Загрузка списка услуг...</p>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => setView('catalog')}
            style={{ padding: '12px 24px', fontSize: '16px', background: 'transparent', border: '2px solid #2563eb', color: '#2563eb', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Смотреть все услуги
          </button>
        </div>
      </section>

      <section id="about" className="landing-section" style={{ padding: '60px 20px', backgroundColor: '#f8fafc', marginTop: '40px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', fontSize: '32px', color: '#0f172a', marginBottom: '40px' }}>О нашем автосервисе</h2>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto', alignItems: 'center' }}>

          <div style={{ flex: '1 1 500px' }}>
            <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '20px' }}>Надежность, проверенная временем</h3>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', marginBottom: '15px' }}>
              Мы работаем с 2010 года и предлагаем полный спектр услуг по ремонту и техническому обслуживанию автомобилей любых марок. Наша главная цель — обеспечить безопасность и комфорт вашего вождения.
            </p>
            <ul style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}><strong>Гарантия на все виды работ</strong> до 6 месяцев.</li>
              <li style={{ marginBottom: '10px' }}><strong>Собственные поставщики</strong> обеспечивающие комплектующими в быстрые сроки.</li>
              <li style={{ marginBottom: '10px' }}><strong>Современное оборудование</strong> для точной диагностики и устранения неисправностей.</li>
            </ul>
          </div>

          <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
            <img
              src={stoPic}
              alt="Наша ремзона"
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>

        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 СТО Система. Все права защищены.</p>
      </footer>
      {requestModalContent}
    </div>
  );
};

export default LandingPage;