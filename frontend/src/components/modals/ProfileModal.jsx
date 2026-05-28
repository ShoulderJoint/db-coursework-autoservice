import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../api';

const ProfileModal = ({ isOpen, onClose, currentUser, clientData, onProfileUpdate }) => {
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        patronymic: '',
        phone: '',
        email: ''
    });
    const [error, setError] = useState('');

    // Заполняем форму текущими данными при открытии
    useEffect(() => {
        if (clientData && isOpen) {
            setFormData({
                surname: clientData.surname || '',
                name: clientData.name || '',
                patronymic: clientData.patronymic || '',
                phone: clientData.phone || '',
                email: clientData.email || ''
            });
        }
    }, [clientData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Некорректный формат email");
            return; 
        }

        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError("Некорректный формат телефона. Используйте формат +7XXXXXXXXXX");
            return;
        }

        try {
            const res = await apiFetch(`/clients/${currentUser.id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onProfileUpdate(formData);
                onClose();
            } else {
                const err = await res.json();
                setError(err.error || 'Ошибка при сохранении данных');
            }
        } catch (err) {
            console.error(err);
            setError('Ошибка соединения с сервером');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-sm">
                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Настройки профиля</h2>
                {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Фамилия</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.surname}
                            onChange={e => setFormData({ ...formData, surname: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Имя</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Отчество</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.patronymic}
                            onChange={e => setFormData({ ...formData, patronymic: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Телефон</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="btn-secondary" onClick={onClose}>Отмена</button>
                        <button type="submit" className="btn-primary">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;