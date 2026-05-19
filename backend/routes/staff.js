const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        //join, чтоб сразу отображались данные
        const staffList = await db.any(`
            SELECT 
                s.id, 
                s.role_id,
                s.surname, 
                s.name, 
                s.patronymic, 
                st.city, 
                r.name as role_name 
            FROM staff s
            JOIN stations st ON s.station_id = st.id
            JOIN roles r ON s.role_id = r.id
        `);
        const stations = await db.any('SELECT id, city FROM stations');
        const roles = await db.any('SELECT id, name FROM roles');
        const systemRoles = await db.any('SELECT id, display_name FROM system_roles');

        res.json({
            staff: staffList,
            meta: {
                stations,
                roles,
                systemRoles
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка получения данных из БД" });
    }
});

module.exports = router;