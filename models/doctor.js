const mongoose = require('mongoose');


const doctorSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
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
        default: 0,
        min: 1,
        max: 5
    },
});

module.exports = mongoose.model('Doctor', doctorSchema);
