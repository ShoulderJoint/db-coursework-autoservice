const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const {surname, name, patronymic, phone, password}=req.body;
    try {
        let user;

        user = await db.any(`
                SELECT 
                    
                `);

        res.json();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка входа" });
    }
});

router.put('/', async (req, res) => {
    try {
        let user;

        user = await db.any(`
                SELECT 
                    
                `);

        res.json();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка входа" });
    }
});

module.exports = router;