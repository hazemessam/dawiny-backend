// Third party modules
const bcrypt = require('bcrypt');

// Application modules
const { Patient } = require('../models/patient');
const { CustomError } = require('../utils/errors');
const { genAccessToken, genRefreshToken } = require('../services/auth/token');
const { DoctorReservation } = require('../models/doctor');


async function getPatientById(req, res, next) {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return next(new CustomError('Not found', 404));

    patient.password = undefined;
    return res.json(patient);
}


async function addPatient(req, res, next) {
    const email = req.body.email;
    if (!email) return next(new CustomError(`Email must be exist`, 400));
    let patient = await Patient.findOne({ email });
    if (patient) return next(new CustomError(`${req.body.email} is already exist`, 422));

    const password = req.body.password;
    if (!password) return next(new CustomError(`Password must be exist`, 400));
    req.body.password = await bcrypt.hash(password, 10);

    patient = await Patient.create(req.body);
    const payload = { userId: patient._id, role: 'patient' };
    const access = genAccessToken(payload, '1h');
    const refresh = genRefreshToken(payload);
    return res.status(201).json({ access, refresh });
}


async function updatePatientById(req, res, next) {
    let patient = await Patient.findById(req.params.id);
    if (!patient) return next(new CustomError('Not found', 404));

    const email = req.body.email;
    if (email && await Patient.findOne({ email }))
        return next(new CustomError(`${email} is already exist`, 422));

    const password = req.body.password;
    if (password) req.body.password = await bcrypt.hash(password, 10);

    const updateOptions = { returnOriginal: false, runValidators: true };
    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, updateOptions);

    patient.password = undefined;
    return res.json(patient);
}


async function deletePatientById(req, res, next) {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return next(new CustomError('Not found', 404));

    res.json({ _id: patient._id });
}


async function getPatientReservations(req, res, next) {
    const patientId = req.params.id;
    const patientReservations = await DoctorReservation.find({ patientId });
    
    return res.json(patientReservations);
}


module.exports = {
    getPatientById,
    addPatient,
    updatePatientById,
    deletePatientById,
    getPatientReservations
}
