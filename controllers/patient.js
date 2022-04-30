const Patient = require('../models/patient');
const { asyncWrapper, CustomError } = require('../utils/errors');


const getAllPatients = asyncWrapper(async (req, res) => {
    const patients = await Patient.find();
    for (let patient of patients)
        patient.password = undefined;
    return res.json(patients);
});


const getPatientById = asyncWrapper(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) throw new CustomError('Not found', 404);
    patient.password = undefined;
    return res.json(patient);
});


const addPatient = asyncWrapper(async (req, res) => {
    let patient = await Patient.findOne({email: req.body.email});
    if (patient) throw new CustomError(`${req.body.email} is already exist`, 422);
    patient = await Patient.create(req.body);
    return res.status(201).json(patient);
});


const updatePatientById = asyncWrapper(async (req, res) => {
    let patient = await Patient.findById(req.params.id);
    if (!patient) throw new CustomError('Not found', 404);
    if (await Patient.findOne({email: req.body.email}))
        throw new CustomError(`${req.body.email} is already exist`, 422);
    const updateOptions =  { returnOriginal: false, runValidators: true };
    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, updateOptions);
    return res.json(patient);
});


const deletePatientById = asyncWrapper(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) throw new CustomError('Not found', 404);
    res.json({_id: patient._id});
});


module.exports = {
    getAllPatients,
    getPatientById,
    addPatient,
    updatePatientById,
    deletePatientById
}
