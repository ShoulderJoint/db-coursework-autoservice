const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transliter = require('cyrillic-to-translit-js')();
const { sendPasswordEmail } = require('../utils/mailer');

async function generateUniqueLogin(db, firstName, patronymic, lastName) {
    const initials = (firstName.charAt(0) + patronymic.charAt(0)).toLowerCase();
    const baseWord = `${initials}_${lastName.toLowerCase()}`;

    const baseLogin = transliter.transform(baseWord);

    const existingLogins = await db.any(
        `SELECT login FROM clients WHERE login LIKE $1`,
        [`${baseLogin}%`]
    );

    if (existingLogins.length === 0) {
        return baseLogin;
    }

    const loginSet = new Set(existingLogins.map(row => row.login));
    let counter = 1;
    let newLogin = `${baseLogin}${counter}`;

    while (loginSet.has(newLogin)) {
        counter++;
        newLogin = `${baseLogin}${counter}`;
    }

    return newLogin;
}

router.get('/', async (req, res) => {
    try {
        const clients = await db.any(`
            SELECT 
                id, 
                surname, 
                name, 
                patronymic, 
                phone, 
                email, 
                login 
            FROM clients 
            ORDER BY id DESC
        `);
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка получения клиентов" });
    }
});
router.post('/', async (req, res) => {

    const { surname, name, patronymic, phone, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Некорректный формат email' });
    }
    const phoneRegex = /^\+7\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Некорректный формат телефона' });
    }

    try {
        const login = await generateUniqueLogin(db, name, patronymic, surname);

        const rawPassword = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const newClient = await db.one(
            `INSERT INTO clients (surname, name, patronymic, phone, password_hash, login, email, system_role_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 1) 
             RETURNING id, surname, name, patronymic, phone, login, email`,
            [surname, name, patronymic, phone, hashedPassword, login, email]
        );

        if (email) {
            const emailSent = await sendPasswordEmail(email, login, rawPassword);
        
            if (!emailSent) {
                console.log(`[ОШИБКА ПОЧТЫ] Данные для ${surname}: Логин - ${login}, Пароль - ${rawPassword}`);
            }
        }
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { surname, name, patronymic, phone, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Некорректный формат email' });
    }
    const phoneRegex = /^\+7\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Некорректный формат телефона' });
    }

    try {
        await db.none(
            `UPDATE clients 
             SET surname = $1, name = $2, patronymic = $3, phone = $4, email = $5 
             WHERE id = $6`,
            [surname, name, patronymic, phone, email, id]
        );
        res.status(200).json({ message: 'Данные клиента обновлены' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при обновлении' });
    }
});

router.post('/:id/grant-access', async (req, res) => {
    const clientId = req.params.id;

    try {
        // 1. Получаем данные клиента
        const client = await db.oneOrNone('SELECT name, patronymic, surname, email FROM clients WHERE id = $1', [clientId]);

        if (!client) {
            return res.status(404).json({ error: 'Клиент не найден' });
        }

        if (!client.email) {
            return res.status(400).json({ error: 'У клиента не указан email для отправки пароля' });
        }

        // 2. Подготавливаем безопасные строки для генератора логина
        // Если отчества или фамилии нет, подставляем дефолтные буквы/слова, чтобы избежать ошибки .charAt(0)
        const safeName = client.name || 'user';
        const safePatronymic = client.patronymic || 'x'; 
        const safeSurname = client.surname || 'client';

        const login = await generateUniqueLogin(db, safeName, safePatronymic, safeSurname);

        // 3. Генерируем пароль
        const rawPassword = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // 4. Обновляем запись (system_role_id = 1 — это роль клиента)
        await db.none(`
            UPDATE clients 
            SET login = $1, password_hash = $2, system_role_id = 1 
            WHERE id = $3
        `, [login, hashedPassword, clientId]);

        // 5. Отправляем письмо
        const emailSent = await sendPasswordEmail(client.email, login, rawPassword);
        
        if (!emailSent) {
            console.log(`[ОШИБКА ПОЧТЫ] Данные для ${client.surname || client.name}: Логин - ${login}, Пароль - ${rawPassword}`);
        }

        res.status(200).json({ message: 'Доступ успешно выдан, письмо отправлено' });
    } catch (error) {
        console.error('Ошибка выдачи доступа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера при генерации доступов' });
    }
});

module.exports = router;