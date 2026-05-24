require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const clientsRouter = require('./routes/clients');
const carsRouter = require('./routes/cars');
const staffRouter = require('./routes/staff');
const applicationsRouter = require('./routes/applications');
const workOrderRouter = require('./routes/orders');
const catalogRouter = require('./routes/catalog');
const logisticsRouter=require('./routes/logistics');

const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/clients', clientsRouter);
app.use('/cars', carsRouter);
app.use('/applications', applicationsRouter);
app.use('/orders', workOrderRouter);
app.use('/catalog', catalogRouter);
app.use('/logistics', logisticsRouter);
app.use('/staff', staffRouter);

app.use('/auth', authRouter);

module.exports = app;
