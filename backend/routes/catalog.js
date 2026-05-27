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
    const { name, price } = req.body;
    try {
        await db.none(`
            INSERT INTO services (name, price)
            VALUES ($1, $2)
        `, [name, parseFloat(price)]);
        res.status(201).json({ message: 'Услуга добавлена в каталог' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { name, price } = req.body;
    try {
        await db.none(`
            UPDATE services 
            SET name = $1, price = $2
            WHERE id = $3
        `, [name, parseFloat(price), req.params.id]);
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