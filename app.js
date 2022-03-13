// Third party modules
const express = require('express');

// Application modules
const logger = require('./middlewares/logger');
const doctorRouter = require('./routers/doctor');
const patientRouter = require('./routers/patient');
const nurseRouter = require('./routers/nurse');


const app = express();

// Middlewares
app.use(logger);

app.use('/api/doctors', doctorRouter);
app.use('/api/patients', patientRouter);
app.use('/api/nurses', nurseRouter);

app.use('/', (req, res, next) => {
    res.send('<h2>Server is running!</h2>');
});

module.exports = app;
