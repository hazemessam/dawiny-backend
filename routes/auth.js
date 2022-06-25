// Third party modules
const express = require('express');

// Application modules
const { login, reGenAccessToken } = require('../controllers/auth');


const router = express.Router();

router.route('/login').post(login);
router.route('/token').post(reGenAccessToken);

module.exports = router;
