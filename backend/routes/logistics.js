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