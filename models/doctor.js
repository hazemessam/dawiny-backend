const mongoose = require('mongoose');


const doctorSchema = mongoose.Schema({
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    gender: { type: String, trim: true, enum: ['male', 'female'] },
    dateOfBirth: { type: String },
    imageUrl: { type: String, trim: true },
    clinicAddress: { type: String, trim: true },
    specification: { type: String, trim: true },
    price: { type: Number, default: 0.0 },
    rate: { type: Number, default: 0, min: 0, max: 5 },
    status: { type: String, trim: true, enum: ["online", "offline"] },
    slots: { type: [{ day: String, start: String, end: String }] }
});

const doctorReservasionSchema = mongoose.Schema({
    doctorId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId, required: true },
    slotId: { type: mongoose.Types.ObjectId, required: true },
    date: { type: String, required: true, trim: true }
});

module.exports = {
    Doctor: mongoose.model('Doctor', doctorSchema),
    DoctorReservation: mongoose.model('DoctorReservation', doctorReservasionSchema),
}
