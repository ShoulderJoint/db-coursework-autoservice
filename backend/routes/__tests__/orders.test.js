const request = require('supertest');
const app = require('../../app');
const { result } = require('../../db');

test('Проверка метода get /orders по получению всех Заказ-нарядов', async () => {
    await request(app)
    .get('/orders')
    .expect('Content-Type', /json/)
    .expect(200);
});

test('Проверка метода get /orders:id по получению несуществующего ЗН', async () => {
    const notExistedOrderId=1233;
    await request(app)
    .get(`/orders/${notExistedOrderId}`)
    .expect(500);
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

test('Проверка метода post /orders:id/parts по добавлению комплектующих в Заказ-наряд', async () => {
    const workOrderId=9;
    addedData={
        customName: "Мотороное Масло CompanyName", 
        isClientProvided: true
    };
    const res=await request(app)
        .post(`/orders/${workOrderId}/parts`)
        .send(addedData)
        .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(201);
});