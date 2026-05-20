const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stations', async (req, res) => {
    try {
        const stations = await db.any('SELECT * FROM stations');
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vendors', async (req, res) => {
    try {
        const vendors = await db.any('SELECT * FROM vendors');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/vendors', async (req, res) => {
    const { name, region, city, street, house, flat, postcode, inn, phone } = req.body;
    try {
        await db.none(`
            INSERT INTO vendors (name, region, city, street, house, flat, postcode, inn, phone)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [name, region, city, street, house, flat || null, postcode || null, inn, phone || null]);
        res.status(201).json({ message: 'Поставщик добавлен' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновление поставщика
router.put('/vendors/:id', async (req, res) => {
    const { name, region, city, street, house, flat, postcode, inn, phone } = req.body;
    try {
        await db.none(`
            UPDATE vendors 
            SET name = $1, region = $2, city = $3, street = $4, house = $5, flat = $6, postcode = $7, inn = $8, phone = $9
            WHERE id = $10
        `, [name, region, city, street, house, flat || null, postcode || null, inn, phone || null, req.params.id]);
        res.json({ message: 'Данные поставщика обновлены' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/partscontracts', async (req, res) => {
    try {
        const partsContracts = await db.any(`
            SELECT 
                pc.id, 
                v.name, 
                to_char(pc.created_at,'DD-MM-YYYY HH24:MI:SS') as created, 
                to_char(pc.updated_at,'DD-MM-YYYY HH24:MI:SS') as updated, 
                pc.file_name
            FROM parts_contracts pc
            JOIN vendors v ON pc.vendor_id = v.id
            `);
        
        res.json(partsContracts);
    } catch (error) {
        res.status(500).json({ error: "Ошибка получения договоров" });
    }
});

module.exports = router;