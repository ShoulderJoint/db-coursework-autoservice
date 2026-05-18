const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', async (req, res) => {
    // Временно читаем роль и ID из URL-параметров
    const { role, userId } = req.query;

    try {
        let cars;
        if (role === 'client') {
            // ЛОГИКА КЛИЕНТА: Ищем машины строго по его ID
            cars = await db.any(`
                SELECT id, brand, model, production_year, reg_number, vin 
                FROM cars 
                WHERE client_id = $1
            `, [userId]);
            
        } else {
            // ЛОГИКА ПЕРСОНАЛА: Отдаем все машины базы. 
            // Здесь уместно использовать JOIN, чтобы админ видел, чья это машина.
            cars = await db.any(`
                SELECT 
                    c.id, c.brand, c.model, c.production_year, c.reg_number, c.vin,
                    cl.patronymic, cl.surname, cl.name, cl.phone
                FROM cars c
                JOIN clients cl ON c.client_id = cl.id
                ORDER BY c.id DESC
            `);
        }

        res.json(cars);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка получения автопарка" });
    }
});
module.exports = router;