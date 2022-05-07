// Third party modules
const express = require('express');

// Application modules
const { getAllNurses, getNurseById, addNurse, updateNurseById, deleteNurseById } = require('../controllers/nurse');


const router = express.Router();

router.route('/')
    .get(getAllNurses)
    .post(addNurse);

router.route('/:id')
    .get(getNurseById)
    .patch(updateNurseById)
    .delete(deleteNurseById);

module.exports = router;
