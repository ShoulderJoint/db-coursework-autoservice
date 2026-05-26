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

module.exports = router;