// Third party modules
const express = require('express');

// Application modules
const { getAllDoctors, getDoctorById, addDoctor, updateDoctorById, deleteDoctorById } = require('../controllers/doctor');
const { authenticate } = require('../middlewares/auth');


const router = express.Router();

router.route('/')
    .get(authenticate, getAllDoctors)
    .post(addDoctor);

router.route('/:id')
    .get(authenticate, getDoctorById)
    .patch(authenticate, updateDoctorById)
    .delete(authenticate, deleteDoctorById);

module.exports = router;
