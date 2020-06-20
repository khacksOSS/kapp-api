const express = require('express');
const router = express.Router();

const {
  seedDataArticle,
  permissions,
  addPermission,
} = require('../controllers/permissionController');

// seed data removing pervious data
router.get('/seed', seedDataArticle);

// get all permissions
router.get('/details', permissions);

// post permissions
router.post('/create', addPermission);

module.exports = router;
