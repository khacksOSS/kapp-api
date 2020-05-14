const express = require('express');
const checkAuth = require('../middlerware/check_auth');
const checkAccess = require('../middlerware/check_access');
const router = express.Router();

const {
    clearDataUser,
    details,
    signup,
    verification,
    login,
} = require('../controllers/studentController');

// clear data
router.get('/clear', clearDataUser);

// get all user
router.get('/details', details);

// user signup
router.post('/signup', signup)

// user verification
router.get('/verification', verification)

// user login
router.post('/login', login)

module.exports = router