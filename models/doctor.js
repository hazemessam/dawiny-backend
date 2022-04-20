const mongoose = require('mongoose');


const doctorSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        enum: ['male', 'female'] 
    },
    age: {
        type: Number
    },
    imageUrl: {
        type: String,
        trim: true
    },
    clinicAddress: { 
        type: String,
        trim: true
    },
    specification: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        default: 0.0
    },
    rate: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
});

module.exports = mongoose.model('Doctor', doctorSchema);
