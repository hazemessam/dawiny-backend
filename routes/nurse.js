// Third party modules
const express = require('express');

// Application modules
const { getAllNurses, getNurseById, addNurse, updateNurseById, deleteNurseById } = require('../controllers/nurse');
const { authenticate } = require('../middlewares/auth');


const router = express.Router();

router.route('/')
    .get(authenticate, getAllNurses)
    .post(addNurse);

router.route('/:id')
    .get(authenticate, getNurseById)
    .patch(authenticate, updateNurseById)
    .delete(authenticate, deleteNurseById);

module.exports = router;
