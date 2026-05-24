const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Нет доступа. Токен не предоставлен.' });
    }

    const token = authHeader.split(' ')[1]; //отрезание 'beaver'

    if (!token) {
        return res.status(401).json({ error: 'Неверный формат токена.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Недействительный или просроченный токен.' });
    }
};