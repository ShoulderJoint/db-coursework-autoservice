const express = require('express');
const router = express.Router();
const db = require('../db'); 
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        let query = `
            SELECT c.*, cl.patronymic as client_patronymic, cl.name as client_name, cl.surname as client_name 
            FROM cars c
            JOIN clients cl ON c.client_id = cl.id
        `;
        const params = [];

        if (req.user.role === 'client') {
            query += ' WHERE c.client_id = $1';
            params.push(req.user.id);
        }

        const cars = await db.any(query, params);
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.post('/', async (req, res) => {
    const { clientId, brand, model, productionYear, vin, regNumber } = req.body;
    try {
        await db.none(`
            INSERT INTO cars (client_id, brand, model, production_year, vin, reg_number)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [clientId, brand, model, productionYear, vin, regNumber]);
        res.status(201).json({ message: 'Автомобиль добавлен' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { clientId, brand, model, productionYear, vin, regNumber } = req.body;
    try {
        await db.none(`
            UPDATE cars 
            SET client_id = $1, brand = $2, model = $3, production_year = $4, vin = $5, reg_number = $6
            WHERE id = $7
        `, [clientId, brand, model, productionYear, vin, regNumber, req.params.id]);
        res.json({ message: 'Данные автомобиля обновлены' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;