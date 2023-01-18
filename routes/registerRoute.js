const express = require('express');
const router = express.Router();
const { registerValidation } = require('../validations/validations');
const { registerUser } = require('../controllers/userController.js');

router.post('/', registerValidation, registerUser);

module.exports = router;