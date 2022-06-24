// Third party modules
const express = require('express');

// Application modules
const { getAllNurses, getNurseById, addNurse, updateNurseById, deleteNurseById } = require('../controllers/nurse');
const { authenticate, authorize } = require('../middlewares/auth');
const { actions } = require('../permissions');


const router = express.Router();

router.route('/')
    .get(authenticate, authorize(actions.GET_NURSES), getAllNurses)
    .post(addNurse);

router.route('/:id')
    .get(authenticate, authorize(actions.GET_NURSE), getNurseById)
    .patch(authenticate, authorize(actions.UPDATE_NURSE), updateNurseById)
    .delete(authenticate, authorize(actions.DELETE_NURSE), deleteNurseById);

module.exports = router;
