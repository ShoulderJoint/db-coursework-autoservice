const request = require('supertest');
const app = require('../../app');

test('Проверка метода get /orders по получению всех Заказ-нарядов', async () => {
    await request(app)
    .get('/orders')
    .expect('Content-Type', /json/)
    .expect(200);
});

test('Проверка метода post /orders по добавлению Заказ-наряда', async () => {
    newOrder = {
        applicationId: 2, 
        staffId: 5,   
        services: 5
    };
    const res = await request(app)
        .post('/orders')
        .send(newOrder)
        .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(201);
});

test('Проверка метода put /orders:id/status по обновлению статуса Заказ-наряда', async () => {
    const updatedOrderId=9;
    const updatedData={
        statusId: 2
    };
    const res = await request(app)
        .put(`/orders/${updatedOrderId}/status`)
        .send(updatedData)
        .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(200);
});