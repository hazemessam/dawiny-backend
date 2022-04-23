// Third party modules
const express = require('express');

// Application modules
const { getAllDoctors, getDoctorById, addDoctor, updateDoctorById, deleteDoctorById } = require('../controllers/doctor');


const router = express.Router();

router.route('/')
    .get(getAllDoctors)
    .post(addDoctor);

router.route('/:id')
    .get(getDoctorById)
    .patch(updateDoctorById)
    .delete(deleteDoctorById);

module.exports = router;
