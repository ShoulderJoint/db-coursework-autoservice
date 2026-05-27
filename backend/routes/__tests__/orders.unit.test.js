const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

jest.mock('../../db', () => ({
    any: jest.fn(),
    one: jest.fn(),
    none: jest.fn()
}));

jest.mock('../../middleware/authMiddleware', () => {
    return (req, res, next) => {
        req.user = { id: 1, role: 'advisor' }; 
        next();
    };
});

describe('Unit Test: Get order by ID', () => {
    it('Should make a get request', async () => {
        db.one.mockResolvedValue({ 
            id: 1, 
            status_id: 2, 
            public_number: 'ЗН-2026-00001' 
        });
        const res = await request(app).get('/orders/1');

        expect(res.statusCode).toBe(200);
        expect(res.body.public_number).toBe('ЗН-2026-00001');
        expect(db.one).toHaveBeenCalled(); 
    });
});