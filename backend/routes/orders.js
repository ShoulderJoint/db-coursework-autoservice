const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', async (req, res) => {
    // Временно читаем роль и ID из URL-параметров
    const { role, userId } = req.query;

    try {
        let orders;
        if (role === 'client') {
            orders = await db.any(`
                SELECT 
                    o.id AS order_id,
                    a.id AS application_id
                    s.surname AS staff_surname,
                    s.name AS staff_name,
                    s.patronymic AS staff_patronymic,
                    st.region,
                    st.city,
                    st.street,
                    st.house,
                    os.name AS status_name,
                    o.cost_parts,
                    o.cost_services,
                    o.cost,
                    o.created_at,
                    o.closed_at,
                    c.brand,
                    c.model,
                    c.reg_number
                FROM orders o
                join applications a on o.application_id=a.id
                left join staff s on a.staff_id=s.id
                JOIN order_statuses os ON o.status_id = os.id
                join stations st on s.station_id=st.id
                join cars c on a.car_id=c.id
                join clients cl on c.client_id=cl.id
                WHERE cl.id = $1
                ORDER BY a.id DESC
            `, [userId]);
            
        } else {
            orders = await db.any(`
                SELECT 
                    o.id AS order_id,
                    a.id AS application_id,
                    s.surname AS staff_surname,
                    s.name AS staff_name,
                    s.patronymic AS staff_patronymic,
                    st.region,
                    st.city,
                    st.street,
                    st.house,
                    os.name AS status_name,
                    o.cost_parts,
                    o.cost_services,
                    o.cost,
                    o.created_at,
                    o.closed_at,
                    c.brand,
                    c.model,
                    c.reg_number,
                    cl.surname AS client_surname,
                    cl.name AS client_name,
                    cl.patronymic AS client_patronymic
                FROM orders o
                join applications a on o.application_id=a.id
                join staff s on a.staff_id=s.id
                join stations st on s.station_id=st.id
                JOIN order_statuses os ON o.status_id = os.id
                join cars c on a.car_id=c.id
                join clients cl on c.client_id=cl.id
                ORDER BY a.id DESC
            `);
        }
        const statuses = await db.any('SELECT id, name FROM order_statuses');

        // Отправляем данные и метаданные
        res.json({
            orders: orders,
            meta: {
                statuses: statuses
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка получения автопарка" });
    }
});
router.post('/', async (req, res) => {
    const { applicationId, staffId, services } = req.body;

    try {
        //запуск транзакции
        await db.tx(async t => {
            const order = await t.one(`
                INSERT INTO orders (application_id, staff_id)
                VALUES ($1, $2)
                RETURNING id
            `, [applicationId, staffId]);

            if (services && services.length > 0) {
                const queries = services.map(s => {
                    return t.none(`
                        INSERT INTO order_service (service_id, work_order_id, count, coefficient, cost)
                        VALUES ($1, $2, $3, $4, $5)
                    `, [s.serviceId, order.id, s.count, s.coeff, s.cost]);
                });
                await t.batch(queries);
            }
            return order;
        });
        res.status(201).json({ message: "Заказ-наряд успешно создан" });
    } catch (error) {
        console.error('Ошибка при создании ЗН:', error);
        res.status(500).json({ error: "Ошибка при сохранении в базу данных" });
    }
});
router.get('/:id/parts', async (req, res) => {
    try {
        const parts = await db.any(`
            SELECT op.id, pci.name, op.count, op.cost
            FROM order_parts op
            JOIN parts_contract_items pci ON op.spare_part_id = pci.id
            WHERE op.work_order_id = $1
        `, [req.params.id]);
        res.json(parts);
    } catch (error) {
        res.status(500).json({ error: "Ошибка получения запчастей" });
    }
});
// POST: Добавление запчасти в существующий ЗН
router.post('/:id/parts', async (req, res) => {
    const workOrderId = req.params.id; // Берем ID заказ-наряда из URL
    const { sparePartId, count, cost } = req.body; // Получаем данные от фронтенда

    try {
        // Делаем простую вставку. 
        // Триггер trg_update_costs_parts сработает сам и пересчитает сумму ЗН!
        await db.none(`
            INSERT INTO order_parts (work_order_id, spare_part_id, count, cost)
            VALUES ($1, $2, $3, $4)
        `, [workOrderId, sparePartId, count, cost]);

        res.status(201).json({ message: "Комплектующее успешно добавлено" });
    } catch (error) {
        console.error('Ошибка добавления запчасти:', error);
        // Если ЗН закрыт, наш триггер блокировки выкинет ошибку, и мы передадим её на фронт
        res.status(403).json({ error: error.message || "Ошибка при сохранении" });
    }
});
// Получение услуг конкретного ЗН
router.get('/:id/services', async (req, res) => {
    try {
        const services = await db.any(`
            SELECT os.id, s.name, os.count, os.coefficient, os.cost
            FROM order_service os
            JOIN services s ON os.service_id = s.id
            WHERE os.work_order_id = $1
        `, [req.params.id]);
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "Ошибка получения услуг" });
    }
});

module.exports = router;