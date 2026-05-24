const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await db.oneOrNone('SELECT * FROM clients WHERE login = $1', [login]);

        if (!user) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash.toString());
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        if (user.is_first_login) {
            const tempToken = jwt.sign(
                { id: user.id },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
            );

            return res.status(403).json({
                message: 'Требуется смена пароля',
                isFirstLogin: true,
                tempToken
            });
        }

        const payload = { id: user.id, role: user.system_role_id };

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Защита от XSS (недоступно из JavaScript на клиенте)
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 дней в миллисекундах
            // secure: true, //при вынесении на сервер, передача только https
        });

        res.status(200).json({
            message: 'Успешный вход',
            accessToken,
            user: { id: user.id, login: user.login }
        });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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