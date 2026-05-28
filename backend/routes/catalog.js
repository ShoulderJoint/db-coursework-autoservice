const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const services = await db.any('SELECT * FROM services');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.use(authMiddleware);

router.post('/', async (req, res) => {
    const { name, price, description, estimated_time_minutes } = req.body;
    try {
        await db.none(`
            INSERT INTO services (name, price, description, estimated_time_minutes)
            VALUES ($1, $2, $3, $4)
        `, [name, parseFloat(price), description, parseInt(estimated_time_minutes, 10)]);
        res.status(201).json({ message: 'Услуга добавлена в каталог' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { name, price, description, estimated_time_minutes } = req.body;
    try {
        await db.none(`
            UPDATE services 
            SET name = $1, price = $2, description = $3, estimated_time_minutes = $4
            WHERE id = $5
        `, [name, parseFloat(price), description, parseInt(estimated_time_minutes, 10), req.params.id]);
        res.json({ message: 'Данные услуги обновлены' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/parts', async (req, res) => {
    try {
        const parts = await db.any('SELECT id, name FROM parts_contract_items ORDER BY name');
        res.json(parts);
    } catch (error) {
        res.status(500).json({ error: "Ошибка получения каталога запчастей" });
    }
});

module.exports = router;