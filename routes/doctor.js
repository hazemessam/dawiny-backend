// Third party modules
const express = require('express');

// Application modules
const { getAllDoctors, getDoctorById, addDoctor, updateDoctorById, deleteDoctorById,
    checkAppointment, bookAppointment } = require('../controllers/doctor');
const { authenticate, authorize } = require('../middlewares/auth');
const { actions } = require('../permissions');


const router = express.Router();

router.route('/')
    .get(authenticate, authorize(actions.GET_DOCTORS), getAllDoctors)
    .post(addDoctor);

router.route('/:id')
    .get(authenticate, authorize(actions.GET_DOCTOR), getDoctorById)
    .patch(authenticate, authorize(actions.UPDATE_DOCTOR), updateDoctorById)
    .delete(authenticate, authorize(actions.DELETE_DOCTOR), deleteDoctorById);

router.route('/:id/reservations')
    .post(authenticate, authorize(actions.BOOK_DOCTOR), checkAppointment, bookAppointment);

module.exports = router;
