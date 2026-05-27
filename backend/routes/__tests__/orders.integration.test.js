const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const jwt = require('jsonwebtoken');

const generateTestToken = (userId, role) => {

    const secret = process.env.JWT_SECRET || '5c8140793205e9c264d7bdf2a7bf62dbabfb67e584872f9d66686bcef4a402ee92b30f0361f70cd3d2a52699545259d5f383ea421e2f7b7079a13f09eacab1a2';

    return jwt.sign({ id: userId, role: role }, secret, { expiresIn: '1h' });
};

let createdOrderId;

afterAll(async () => {
    await db.$pool.end();
});

describe('Get orders', () => {

    const advToken = generateTestToken(66, 'advisor');

    it('return 200 and json', async () => {
        await request(app)
            .get('/orders')
            .set('Authorization', `Bearer ${advToken}`)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    it('return 500', async () => {
        const notExistedOrderId = 1233;
        await request(app)
            .get(`/orders/${notExistedOrderId}`)
            .set('Authorization', `Bearer ${advToken}`)
            .expect(500);
    });
});

test('Post order', async () => {

    const advToken = generateTestToken(66, 'advisor');

    newOrder = {
        applicationId: 7,
        staffId: 8,
        services: [
            { serviceId: 1, count: 1, coeff: 1, cost: 1500 }
        ]
    };
    const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${advToken}`)
        .send(newOrder)
        .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(201);

    createdOrderId = res.body.id || res.body.orderId;
});

test('Put status in order', async () => {

    const advToken = generateTestToken(66, 'advisor');

    const updatedData = {
        statusId: 2
    };
    const res = await request(app)
        .put(`/orders/${createdOrderId}/status`)
        .set('Authorization', `Bearer ${advToken}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(200);
});

test('Post parts in order', async () => {

    const advToken = generateTestToken(66, 'advisor');

    addedData = {
        sparePartId: null,
        customName: "Колодки тормозные",
        isClientProvided: true,
        count: 1,
        cost: 0
    };
    const res = await request(app)
        .post(`/orders/${createdOrderId}/parts`)
        .set('Authorization', `Bearer ${advToken}`)
        .send(addedData)
        .expect('Content-Type', /json/)
    expect(res.statusCode).toBe(201);
});