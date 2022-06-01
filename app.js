// Third party modules
const express = require('express');
const cors = require('cors');

// Application modules
const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');
const nurseRouter = require('./routes/nurse');
const authRouter = require('./routes/auth');
const { logger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errors');
const { CustomError } = require('./utils/errors');


const app = express();

// Middlewares
app.use(cors());
app.use(logger);
app.use(express.json());

// Handle routes
app.get('/', () => res.json({ msg: 'Server is running...' }));
app.use('/api/auth', authRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/patients', patientRouter);
app.use('/api/nurses', nurseRouter);

// Handle errors
app.use((req, res, next) => next(new CustomError('Not found', 404)));
app.use(errorHandler);

module.exports = app;
