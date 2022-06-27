// Third party modules
const bcrypt = require('bcrypt');

// Application modules
const { Doctor, DoctorReservation } = require('../models/doctor');
const { CustomError } = require('../utils/errors');
const { genAccessToken, genRefreshToken } = require('../services/auth/token');


async function getAllDoctors(req, res, next) {
    const doctors = await Doctor.find();
    return res.json(doctors.map(d => { d.password = undefined; return d; }));
}


async function getDoctorById(req, res, next) {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return next(new CustomError('Not found', 404));

    doctor.password = undefined;
    return res.json(doctor);
}


async function addDoctor(req, res, next) {
    const email = req.body.email;
    if (!email) return next(new CustomError(`Email must be exist`, 400));
    let doctor = await Doctor.findOne({ email });
    if (doctor) return next(new CustomError(`${req.body.email} is already exist`, 422));

    const password = req.body.password;
    if (!password) return next(new CustomError(`Password must be exist`, 400));
    req.body.password = await bcrypt.hash(password, 10);

    doctor = await Doctor.create(req.body);
    const payload = { userId: doctor._id, role: 'doctor' };
    const access = genAccessToken(payload, '1h');
    const refresh = genRefreshToken(payload);
    return res.status(201).json({ access, refresh });
}


async function updateDoctorById(req, res, next) {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) return next(new CustomError('Not found', 404));

    const email = req.body.email;
    if (email && await Doctor.findOne({ email }))
        return next(new CustomError(`${email} is already exist`, 422));

    const password = req.body.password;
    if (password) req.body.password = await bcrypt.hash(password, 10);

    const updateOptions = { returnOriginal: false, runValidators: true };
    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, updateOptions);

    doctor.password = undefined;
    return res.json(doctor);
}


async function deleteDoctorById(req, res, next) {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return next(new CustomError('Not found', 404));

    res.json({ _id: doctor._id });
}


async function checkAppointment(req, res, next) {
    const appointmentId = req.body.appointmentId;
    const date = req.body.date;
    if (!appointmentId || !date)
    return next(new CustomError('Missing appointmentId or date', 400));

    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return next(new CustomError(`No doctor with id ${doctorId}`, 404));

    const appointment = doctor.appointments.id(appointmentId);
    if (!appointment) return next(new CustomError(`No appointment with id ${appointmentId}`, 404));

    const query = { patientId: req.user.id, doctorId, appointmentId, date };
    const isBooked = await DoctorReservation.findOne(query);

    const check = req.query.check;
    if (check && check.toLowerCase() == 'true')
        return res.json({ available: isBooked? false : true });

    if (isBooked) return next(new CustomError('This appointment is already booked', 422));

    return next();
}


async function bookAppointment(req, res, next) {
    const type = req.body.type;
    if (!type) return next(new CustomError('Missing reservation type', 400));

    const doctorReservationData = {
        patientId: req.user.id, doctorId: req.params.id,
        appointmentId: req.body.appointmentId,
        date: req.body.date, type
    };
    const doctorReservation = await DoctorReservation.create(doctorReservationData);

    return res.status(201).json(doctorReservation);
}


async function getDoctorReservations(req, res, next) {
    const doctorId = req.params.id;
    const doctorReservations = await DoctorReservation.find({ doctorId });
    
    return res.json(doctorReservations);
}


module.exports = {
    getAllDoctors,
    getDoctorById,
    addDoctor,
    updateDoctorById,
    deleteDoctorById,
    checkAppointment,
    bookAppointment,
    getDoctorReservations
}
