// Third party modules
const express = require('express');

// Application modules
const { getAllPatients, getPatientById, addPatient, updatePatientById, deletePatientById } = require('../controllers/patient');


const router = express.Router();

router.route('/')
    .get(getAllPatients)
    .post(addPatient);

router.route('/:id')
    .get(getPatientById)
    .patch(updatePatientById)
    .delete(deletePatientById);

module.exports = router;
