const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', async (req, res) => {
    try {
        const clients = await db.any(`
            SELECT id, surname, name, patronymic, phone 
            FROM clients 
            ORDER BY id DESC
        `);
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка получения клиентов" });
    }
});

module.exports = router;