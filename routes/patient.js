// Third party modules
const express = require('express');

// Application modules
const { getPatientById, addPatient, updatePatientById, deletePatientById } = require('../controllers/patient');
const { authenticate, authorize } = require('../middlewares/auth');
const { actions } = require('../permissions');


const router = express.Router();

router.route('/').post(addPatient);

router.route('/:id')
    .get(authenticate, authorize(actions.GET_PATIENT), getPatientById)
    .patch(authenticate, authorize(actions.UPDATE_PATIENT), updatePatientById)
    .delete(authenticate, authorize(actions.DELETE_PATIENT), deletePatientById);

module.exports = router;
