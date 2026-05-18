const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/users');
const clientsRouter = require('./routes/clients');
const carsRouter = require('./routes/cars');
const staffRouter = require('./routes/staff');
const applicationsRouter = require('./routes/applications');
const workOrderRouter = require('./routes/orders');
const logisticsRouter=require('./routes/logistics');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/users', usersRouter);
app.use('/clients', clientsRouter);
app.use('/cars', carsRouter);
app.use('/applications', applicationsRouter);
app.use('/orders', workOrderRouter);
app.use('/logistics', logisticsRouter);
app.use('/staff', staffRouter);

module.exports = app;
