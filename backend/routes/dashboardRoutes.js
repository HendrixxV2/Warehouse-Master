const express = require('express');
const { resumen } = require('../controllers/dashboardController');
const { autorizar } = require('../middleware/auth');

const router = express.Router();
router.get('/resumen', autorizar('supervisor'), resumen);

module.exports = router;
