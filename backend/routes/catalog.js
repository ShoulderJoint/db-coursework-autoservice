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

module.exports = router;