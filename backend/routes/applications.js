const express = require('express');
const router = express.Router();
const db = require('../db'); 
const authMiddleware = require('../middleware/authMiddleware');

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