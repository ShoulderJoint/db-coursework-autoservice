const express = require('express');
const router = express.Router();
const db = require('../db'); 
const authMiddleware = require('../middleware/authMiddleware');

router.post('/public', async (req, res) => {
    const { name, surname, phone, email, brand, model, comment, service_name } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Некорректный формат email' });
    }
    const phoneRegex = /^\+7\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Некорректный формат телефона' });
    }

    try {
        await db.tx(async t => {
            let client = await t.oneOrNone('SELECT id FROM clients WHERE phone = $1', [phone]);
            
            if (!client) {
                client = await t.one(`
                    INSERT INTO clients (name, surname, phone, email) 
                    VALUES ($1, $2, $3, $4) RETURNING id
                `, [name, surname, phone, email]);
            }

            // 2. Ищем машину этого клиента
            let car = await t.oneOrNone(`
                SELECT id FROM cars 
                WHERE client_id = $1 AND brand ILIKE $2 AND model ILIKE $3
            `, [client.id, brand, model]);

            // Если машины нет — добавляем, передавая null вместо заглушек
            if (!car) {
                car = await t.one(`
                    INSERT INTO cars (client_id, brand, model, reg_number, vin) 
                    VALUES ($1, $2, $3, $4, $5) RETURNING id
                `, [client.id, brand, model, null, null]);
            }

            // 3. Формируем текст заявки без приписки
            const fullDescription = service_name 
                ? `Услуга: ${service_name}. ${comment}`.trim() 
                : comment;

            // Создаем заявку
            await t.none(`
                INSERT INTO applications (car_id, staff_id, description, created_at)
                VALUES ($1, $2, $3, NOW())
            `, [car.id, null, fullDescription]);
        });

        res.status(201).json({ message: 'Заявка принята' });
    } catch (error) {
        console.error('Ошибка при сохранении заявки с сайта:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        let query = `
            SELECT 
                a.id, a.car_id, a.staff_id,
                cl.patronymic as client_patronymic, cl.name as client_name, cl.surname as client_surname,
                c.brand, c.model, c.production_year, c.vin, c.reg_number,
                s.patronymic as staff_patronymic, s.name as staff_name, s.surname as staff_surname,
                a.description, a.created_at, a.updated_at
            FROM applications a
            LEFT JOIN staff s on a.staff_id=s.id
            JOIN cars c on a.car_id=c.id
            JOIN clients cl on c.client_id=cl.id
        `;
        const params = [];

        if (req.user.role === 'client') {
            query += ' WHERE cl.id = $1';
            params.push(req.user.id);
        }
        else if (['admin', 'advisor'].includes(req.user.role)) {
            query += ' WHERE s.station_id = $1';
            params.push(req.user.stationId);
        }

        query += ' ORDER BY a.id DESC';

        const applications = await db.any(query, params);
        res.status(200).json(applications);
        
    } catch (err) {
        console.error('Ошибка получения заявок:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

router.post('/', async (req, res) => {
    const { carId, staffId, description } = req.body;
    try {
        await db.none(`
            INSERT INTO applications (car_id, staff_id, description, created_at)
            VALUES ($1, $2, $3, NOW())
        `, [carId, staffId, description]);
        res.status(201).json({ message: 'Заявка создана' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { carId, staffId, description } = req.body;
    try {
        await db.none(`
            UPDATE applications 
            SET car_id = $1, staff_id = $2, description = $3
            WHERE id = $4
        `, [carId, staffId, description, req.params.id]);
        res.json({ message: 'Заявка обновлена' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;