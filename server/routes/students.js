const express = require('express');
const checkAuth = require('../middlerware/check_auth');
const router = express.Router();

const {
  clearDataUser,
  details,
  signup,
  verification,
  login,
} = require('../controllers/studentController');

// clear data and seed one user for dev
router.get('/clear', clearDataUser);

// get all user check authentication
router.get('/details', checkAuth, details);

// user signup
router.post('/signup', signup);

// user verification
router.get('/verification', verification);

// user login
router.post('/login', login);

module.exports = router;
