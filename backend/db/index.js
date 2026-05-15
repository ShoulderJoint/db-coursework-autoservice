const pgp = require('pg-promise')();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'autoservice_kondratev',
    user: 'postgres',
    password: '90577567'
};
const db = pgp(cn);

module.exports = db;