// Third party modules
const express = require('express');

// Application modules
const { getAllDoctors, addDoctor } = require('../controllers/doctor');


const router = express.Router();

router.route('/')
    .get(getAllDoctors)
    .post(addDoctor)

module.exports = router;
