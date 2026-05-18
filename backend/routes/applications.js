const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', async (req, res) => {
    // Временно читаем роль и ID из URL-параметров
    const { role, userId } = req.query;

    try {
        let applications;
        if (role === 'client') {
            applications = await db.any(`
                SELECT 
                    a.id,
                    c.brand,
                    c.model,
                    c.production_year,
                    c.reg_number,
                    s.patronymic,
                    s.name,
                    s.surname,
                    a.description,
                    a.created_at,
                    a.updated_at
                FROM applications a
                LEFT JOIN staff s on a.staff_id=s.id
                join cars c on a.car_id=c.id
                join clients cl on c.client_id=cl.id
                WHERE cl.id = $1
                ORDER BY a.id DESC
            `, [userId]);
            
        } else {
            // ЛОГИКА ПЕРСОНАЛА: Отдаем все машины базы. 
            // Здесь уместно использовать JOIN, чтобы админ видел, чья это машина.
            applications = await db.any(`
                SELECT 
                    a.id,
                    cl.patronymic as client_patronymic,
                    cl.name as client_name,
                    cl.surname as client_surname,
                    c.brand,
                    c.model,
                    c.production_year,
                    c.vin,
                    c.reg_number,
                    s.patronymic as staff_patronymic,
                    s.name as staff_name,
                    s.surname as staff_surname,
                    a.description,
                    a.created_at,
                    a.updated_at
                FROM applications a
                LEFT JOIN staff s on a.staff_id=s.id
                join cars c on a.car_id=c.id
                join clients cl on c.client_id=cl.id
                ORDER BY c.id DESC
            `);
        }
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка получения автопарка" });
    }
});

module.exports = router;