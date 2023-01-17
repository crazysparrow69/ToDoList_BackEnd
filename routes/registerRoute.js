const express = require('express');
const router = express.Router();
const { registerValidation } = require('../validations/authValidation');
const { handleRegistration } = require('../controllers/registerController.js');

router.post('/', registerValidation, handleRegistration);

module.exports = router;