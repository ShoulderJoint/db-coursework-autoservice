const request = require('supertest');
const app = require('../../app');
const { result } = require('../../db');

describe('Get orders', () => {
    it('return 200 and json', async () => {
        await request(app)
            .get('/orders')
            .expect('Content-Type', /json/)
            .expect(200);
    });

    it('return 500', async () => {
        const notExistedOrderId = 1233;
        await request(app)
            .get(`/orders/${notExistedOrderId}`)
            .expect(500);
    });
});

test('Post order', async () => {
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

test('Put status in order', async () => {
    const updatedOrderId = 9;
    const updatedData = {
        statusId: 2
    };
    const res = await request(app)
        .put(`/orders/${updatedOrderId}/status`)
        .send(updatedData)
        .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(200);
});

test('Post parts in order', async () => {
    const workOrderId = 9;
    addedData = {
        customName: "Моторное Масло CompanyName",
        isClientProvided: true
    };
    const res = await request(app)
        .post(`/orders/${workOrderId}/parts`)
        .send(addedData)
        .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(201);
});