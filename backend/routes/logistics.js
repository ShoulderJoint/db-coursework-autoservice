const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/contracts/'); // Папка, куда сохраняем
    },
    filename: function (req, file, cb) {
        const safeBaseName = path.basename(file.originalname); //защита от directory traversal и относительных путей
        let cleared = safeBaseName.replace(/[^a-zA-Z0-9\u0400-\u04FF._-]/g, '_');//защита от спецсимволов
        cleared = cleared.replace(/_+/g, '_');
        const targetDir = 'uploads/contracts/';//защита от перезаписи
        let finalName = cleared;
        if (fs.existsSync(path.join(targetDir, finalName))) {
            const ext = path.extname(finalName); // например pdf
            const base = path.basename(finalName, ext); // имя без расширения
            finalName = `${base}-${Date.now()}${ext}`;
        }
        cb(null, finalName);
    }
});
const upload = multer({ storage: storage });

router.get('/stations', async (req, res) => {
    try {
        const stations = await db.any('SELECT * FROM stations');
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/stations', async (req, res) => {
    const {region, city, street, house, phone } = req.body;
    try {
        await db.none(`
            INSERT INTO stations (region, city, street, house, phone)
            VALUES ($1, $2, $3, $4, $5)
        `, [region, city, street, house, phone]);
        res.status(201).json({ message: 'Филиал успешно добавлен' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/stations/:id', async (req, res) => {
    const {region, city, street, house, phone } = req.body;
    try {
        await db.none(`
            UPDATE stations 
            SET region = $1, city = $2, street = $3, house = $4, phone=$5
            WHERE id = $6
        `, [region, city, street, house, phone, req.params.id]);
        res.json({ message: 'Данные филиала обновлены' });
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

router.post('/partscontracts', upload.single('contractFile'), async (req, res) => {
    const { vendorId } = req.body;
    const fileName = req.file ? req.file.filename : null;

    if (!fileName) return res.status(400).json({ error: "Файл договора обязателен" });

    try {
        await db.none(`
            INSERT INTO parts_contracts (vendor_id, file_name, created_at, updated_at)
            VALUES ($1, $2, NOW(), null)
        `, [vendorId, fileName]);
        res.status(201).json({ message: 'Договор добавлен' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/partscontracts/:id', async (req, res) => {

    try {
        // 1. Узнаем имя файла, чтобы удалить его физически
        const contract = await db.oneOrNone('SELECT file_name FROM parts_contracts WHERE id = $1', [req.params.id]);

        if (contract && contract.file_name) {
            const filePath = path.join(__dirname, '../uploads/contracts/', contract.file_name);
            // Удаляем файл с диска сервера, если он существует
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // 2. Удаляем запись из БД
        await db.none('DELETE FROM parts_contracts WHERE id = $1', [req.params.id]);
        res.json({ message: 'Договор удален' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;