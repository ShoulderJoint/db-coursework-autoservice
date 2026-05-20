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
router.post('/', async (req, res) => {
    const { surname, name, patronymic, phone } = req.body;
    try {
        await db.none(`
            INSERT INTO clients (surname, name, patronymic, phone, login, password_hash, system_role_id)
            VALUES ($1, $2, $3, $4, NULL, NULL, 1)
        `, [surname, name, patronymic, phone]);
        res.status(201).json({ message: 'Клиент добавлен' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { surname, name, patronymic, phone  } = req.body;
    try {
        await db.none(`
            UPDATE clients 
            SET surname = $1, name = $2, patronymic = $3, phone = $4  
            WHERE id = $5
        `, [surname, name, patronymic, phone, req.params.id]);
        res.json({ message: 'Данные клиента обновлены' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;