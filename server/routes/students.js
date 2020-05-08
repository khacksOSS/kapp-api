const express = require('express');
const checkAuth = require('../middlerware/check_auth')
const router = express.Router();

const {
    seedDataUser,
    details,
    login,
} = require('../controllers/studentController');

// seed data
router.get('/seed', seedDataUser);

// get all user
router.get('/details', checkAuth, details)

// user login
router.post('/login', login)

module.exports = router