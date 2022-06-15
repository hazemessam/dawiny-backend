// Third party modules
const bcrypt = require('bcrypt');

// Application modules
const Patient = require('../models/patient');
const { asyncWrapper, CustomError } = require('../utils/errors');
const { genAccessToken, genRefreshToken } = require('../services/auth/token');


const getPatientById = asyncWrapper(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) throw new CustomError('Not found', 404);

    patient.password = undefined;
    return res.json(patient);
});


const addPatient = asyncWrapper(async (req, res) => {
    const email = req.body.email;
    if (!email) throw new CustomError(`Email must be exist`, 400);
    let patient = await Patient.findOne({ email });
    if (patient) throw new CustomError(`${req.body.email} is already exist`, 422);

    const password = req.body.password;
    if (!password) throw new CustomError(`Password must be exist`, 400);
    req.body.password = await bcrypt.hash(password, 10);

    patient = await Patient.create(req.body);
    const payload = { userId: patient._id, role: 'patient' };
    const access = genAccessToken(payload, '1h');
    const refresh = genRefreshToken(payload);
    return res.status(201).json({ access, refresh });
});


const updatePatientById = asyncWrapper(async (req, res) => {
    let patient = await Patient.findById(req.params.id);
    if (!patient) throw new CustomError('Not found', 404);

    const email = req.body.email;
    if (email, await Patient.findOne({ email }))
        throw new CustomError(`${email} is already exist`, 422);

    const updateOptions =  { returnOriginal: false, runValidators: true };
    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, updateOptions);

    patient.password = undefined;
    return res.json(patient);
});


const deletePatientById = asyncWrapper(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) throw new CustomError('Not found', 404);

    res.json({_id: patient._id});
});


module.exports = {
    getPatientById,
    addPatient,
    updatePatientById,
    deletePatientById
}
