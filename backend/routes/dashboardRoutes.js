const express = require('express');
const { resumen } = require('../controllers/dashboardController');

const router = express.Router();
router.get('/resumen', resumen);

module.exports = router;
