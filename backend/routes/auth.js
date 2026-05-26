const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

const roleMap = {
    1: 'client',
    2: 'admin', 
    3: 'advisor', 
    4: 'root'
};

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        let user = await db.oneOrNone('SELECT * FROM clients WHERE login = $1', [login]);
        let isStaff = false;

        if (!user) {
            user = await db.oneOrNone('SELECT * FROM staff WHERE login = $1 AND is_active = true', [login]);
            isStaff = true;
        }

        if (!user) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash.toString());
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        if (!isStaff && user.is_first_login) {
            const setupToken = jwt.sign(
                { id: user.id }, 
                process.env.JWT_ACCESS_SECRET, 
                { expiresIn: '15m' }
            );
            return res.status(403).json({
                message: 'Требуется установка постоянного пароля',
                requiresPasswordSetup: true,
                setupToken
            });
        }

        const payload = { 
            id: user.id, 
            role: roleMap[user.system_role_id] || (isStaff ? 'admin' : 'client') 
        };

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, //защита от xxs
            maxAge: 14 * 24 * 60 * 60 * 1000
            //secure:true //потенциальный https
        });

        res.status(200).json({
            message: 'Успешный вход',
            accessToken,
            user: { 
                id: user.id, 
                login: user.login,
                name: `${user.surname || ''} ${user.name || ''}`.trim(),
                role: payload.role
            }
        });

    } catch (error) {
        console.error('Ошибка авторизации:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

router.put('/password-setup', authMiddleware, async (req, res) => {
    const { newPassword } = req.body;
    
    const userId = req.user.id; 

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.none(
            `UPDATE clients 
             SET password_hash = $1, is_first_login = false 
             WHERE id = $2`,
            [hashedPassword, userId]
        );

        //создание токенов, чтоб не было повторного логина
        const user = await db.one('SELECT id, login, system_role_id, name, surname, patronymic FROM clients WHERE id = $1', [userId]);
        const payload = { id: user.id, role: user.system_role_id };
        
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Пароль успешно изменен',
            accessToken,
            user: { id: user.id, login: user.login }
        });

    } catch (error) {
        console.error('Ошибка при установке пароля:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        //secure:true //потенциальный https
    });
    
    res.status(200).json({ message: 'Выход успешно выполнен' });
});

module.exports = router;