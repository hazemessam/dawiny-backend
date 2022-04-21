// Third party modules
const express = require('express');

// Application modules
const { getAllDoctors, getDoctorById, addDoctor } = require('../controllers/doctor');


const router = express.Router();

router.route('/')
    .get(getAllDoctors)
    .post(addDoctor);

router.route('/:id')
    .get(getDoctorById);

module.exports = router;
