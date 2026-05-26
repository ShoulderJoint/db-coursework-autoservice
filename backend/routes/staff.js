const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    try {
        //join, чтоб сразу отображались данные
        const staffList = await db.any(`
            SELECT 
                s.id, 
                s.role_id,
                s.system_role_id,
                s.station_id,
                s.surname, 
                s.name, 
                s.patronymic, 
                s.login,
                s.is_active,
                st.city, 
                r.name as role_name 
            FROM staff s
            JOIN stations st ON s.station_id = st.id
            JOIN roles r ON s.role_id = r.id
            ORDER BY s.id ASC
        `);
        const stations = await db.any('SELECT id, city, street, house FROM stations');
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

router.post('/', async (req, res) => {
    const { station_id, surname, name, patronymic, role_id, login, password, system_role_id } = req.body;
    try {

        let passwordHash = null;

        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        await db.none(`
            INSERT INTO staff (station_id, surname, name, patronymic, role_id, login, password_hash, system_role_id, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
        `, [station_id, surname, name, patronymic || null, role_id, login || null, passwordHash || null, system_role_id]);

        res.status(201).json({ message: 'Сотрудник успешно добавлен' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { station_id, surname, name, patronymic, role_id, login, system_role_id, is_active } = req.body;
    try {
        await db.none(`
            UPDATE staff 
            SET station_id = $1, surname = $2, name = $3, patronymic = $4, 
                role_id = $5, login = $6, system_role_id = $7, is_active = $8
            WHERE id = $9
        `, [station_id, surname, name, patronymic || null, role_id, login, system_role_id, is_active, req.params.id]);

        res.json({ message: 'Данные сотрудника обновлены' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;