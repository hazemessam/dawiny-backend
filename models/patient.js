const mongoose = require('mongoose');


const patientSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
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
    address: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model('Patient', patientSchema);
