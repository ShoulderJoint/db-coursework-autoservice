const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        //join, чтоб сразу отображались данные
        const data = await db.any(`
            SELECT 
                s.id, 
                s.surname, 
                s.name, 
                s.patronymic, 
                st.city, 
                r.name as role_name 
            FROM staff s
            JOIN stations st ON s.station_id = st.id
            JOIN roles r ON s.role_id = r.id
        `);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка получения данных из БД" });
    }
});

module.exports = router;