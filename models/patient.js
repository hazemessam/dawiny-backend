const mongoose = require('mongoose');


const patientSchema = mongoose.Schema({
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
    address: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model('Patient', patientSchema);
