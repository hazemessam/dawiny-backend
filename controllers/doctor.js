const Doctor = require('../models/doctor');
const { asyncWrapper, CustomError } = require('../utils/errors');


const getAllDoctors = asyncWrapper(async (req, res) => {
    const doctors = await Doctor.find();
    for (let doctor of doctors)
        doctor.password = undefined;

    return res.json(doctors);
});


const getDoctorById = asyncWrapper(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor)
        throw new CustomError('Not found', 404);

    doctor.password = undefined;
    return res.json(doctor);
});


const addDoctor = asyncWrapper(async (req, res) => {
    const requiredFields = ['email', 'password', 'firstName', 'lastName'];
    for (field of requiredFields)
        if (!req.body[field])
            throw new CustomError('Missing requird data', 400);

    let doctor = await Doctor.findOne({email: req.body.email});
    if (doctor)
        throw new CustomError(`${req.body.email} is already exist`, 422);

    doctor = await Doctor.create(req.body);
    return res.status(201).json(doctor);
});


const deleteDoctorById = asyncWrapper(async (req, res) => {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor)
        throw new CustomError('Not found', 404);

    res.json({_id: doctor._id});
});


module.exports = {
    getAllDoctors,
    getDoctorById,
    addDoctor,
    deleteDoctorById
}
