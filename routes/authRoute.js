const express = require('express');
const router = express.Router();
const { handleAuth } = require('../controllers/AuthController.js');

router.post('/', handleAuth);

module.exports = router;