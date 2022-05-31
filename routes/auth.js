// Third party modules
const express = require('express');

// Application modules
const { login } = require('../services/auth/login');


const router = express.Router();

router.route('/login')
    .post(login);

module.exports = router;
