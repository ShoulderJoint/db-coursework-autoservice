const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stations', async (req, res) => {
    try {
        const data = await db.any('SELECT * FROM stations');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;