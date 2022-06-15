// Third party modules
const express = require('express');

// Application modules
const { getPatientById, addPatient, updatePatientById, deletePatientById } = require('../controllers/patient');
// const { authenticate } = require('../middlewares/auth');


const router = express.Router();

router.route('/').post(addPatient);

router.route('/:id')
    .get(getPatientById)
    .patch(updatePatientById)
    .delete(deletePatientById);

module.exports = router;
