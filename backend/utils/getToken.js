require('dotenv').config({ path: '../.env' });

const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || '5c8140793205e9c264d7bdf2a7bf62dbabfb67e584872f9d66686bcef4a402ee92b30f0361f70cd3d2a52699545259d5f383ea421e2f7b7079a13f09eacab1a2';

const token = jwt.sign({ id: 8, role: 'advisor' }, secret, { expiresIn: '24h' });

console.log(token);