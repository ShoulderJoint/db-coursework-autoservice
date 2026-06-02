import React, { useState, useEffect } from 'react';

const formatForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    //сдвиг времени на offset часового пояса, чтобы .toISOString() вернул локальное время
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
};

const ApplicationModal = ({ isOpen, onClose, applicationToEdit, onRefresh, cars, staff }) => {
    const [formData, setFormData] = useState({
        carId: '', staffId: '', description: '', scheduledAt: ''
    });

    useEffect(() => {
        if (applicationToEdit) {
            setFormData({
                //приведение к строке, чтобы react мог сопоставить значение с value у <option>
                carId: applicationToEdit.car_id ? String(applicationToEdit.car_id) : '',
                staffId: applicationToEdit.staff_id ? String(applicationToEdit.staff_id) : '',
                description: applicationToEdit.description || '',
                scheduledAt: formatForInput(applicationToEdit.scheduled_at)
            });
        } else {
            setFormData({ carId: '', staffId: '', description: '', scheduledAt: '' });
        }
    }, [applicationToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = applicationToEdit
            ? `http://localhost:3000/applications/${applicationToEdit.id}`
            : 'http://localhost:3000/applications';
        const method = applicationToEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onRefresh();
                onClose();
            } else {
                const err = await response.json();
                alert(`Ошибка: ${err.error}`);
            }
        } catch (error) {
            alert('Ошибка при сохранении заявки');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '500px' }}>
                <h2>{applicationToEdit ? 'Редактировать заявку' : 'Новая заявка'}</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <select
                        required
                        value={formData.carId} // Строка (например, "1")
                        onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                        style={{ padding: '8px' }}
                    >
                        <option value="">-- Выберите автомобиль --</option>
                        {cars.map(c => (
                            // Передаем строку в value
                            <option key={c.id} value={String(c.id)}>
                                {c.brand} {c.model} {c.reg_number ? `(${c.reg_number})` : ''}
                            </option>
                        ))}
                    </select>

                    <select
                        required
                        value={formData.staffId} // Строка (например, "2")
                        onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                        style={{ padding: '8px' }}
                    >
                        <option value="">-- Выберите администратора --</option>
                        {staff
                            .filter(s => s.role_id === 2)
                            .map(s => (
                                // Передаем строку в value
                                <option key={s.id} value={String(s.id)}>
                                    {s.surname} {s.name}
                                </option>
                            ))
                        }
                    </select>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '14px', color: '#4b5563' }}>Дата и время записи (необязательно):</label>
                        <input 
                            type="datetime-local" 
                            value={formData.scheduledAt}
                            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            style={{ padding: '8px', fontFamily: 'inherit' }}
                        />
                    </div>

                    <textarea
                        placeholder="Описание проблемы со слов клиента"
                        required
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ padding: '8px', resize: 'vertical' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
                        <button type="submit" className="btn-primary">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;