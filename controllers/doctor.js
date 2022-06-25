// Third party modules
const bcrypt = require('bcrypt');

// Application modules
const { Doctor } = require('../models/doctor');
const { asyncWrapper, CustomError } = require('../utils/errors');
const { genAccessToken, genRefreshToken } = require('../services/auth/token');


const getAllDoctors = asyncWrapper(async (req, res) => {
    const doctors = await Doctor.find();
    return res.json(doctors.map(d => { d.password = undefined; return d }));
});


const getDoctorById = asyncWrapper(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) throw new CustomError('Not found', 404);

    doctor.password = undefined;
    return res.json(doctor);
});


const addDoctor = asyncWrapper(async (req, res) => {
    const email = req.body.email;
    if (!email) throw new CustomError(`Email must be exist`, 400);
    let doctor = await Doctor.findOne({ email });
    if (doctor) throw new CustomError(`${req.body.email} is already exist`, 422);

    const password = req.body.password;
    if (!password) throw new CustomError(`Password must be exist`, 400);
    req.body.password = await bcrypt.hash(password, 10);

    doctor = await Doctor.create(req.body);
    const payload = { userId: doctor._id, role: 'doctor' };
    const access = genAccessToken(payload, '1h');
    const refresh = genRefreshToken(payload);
    return res.status(201).json({ access, refresh });
});


const updateDoctorById = asyncWrapper(async (req, res) => {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) throw new CustomError('Not found', 404);

    const email = req.body.email;
    if (email && await Doctor.findOne({ email }))
        throw new CustomError(`${email} is already exist`, 422);

    const password = req.body.password;
    if (password) req.body.password = await bcrypt.hash(password, 10);

    const updateOptions =  { returnOriginal: false, runValidators: true };
    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, updateOptions);

    doctor.password = undefined;
    return res.json(doctor);
});


const deleteDoctorById = asyncWrapper(async (req, res) => {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) throw new CustomError('Not found', 404);

    res.json({_id: doctor._id});
});


module.exports = {
    getAllDoctors,
    getDoctorById,
    addDoctor,
    updateDoctorById,
    deleteDoctorById
}
