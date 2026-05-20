const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const services = await db.any('SELECT * FROM services');
        res.json(services);
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