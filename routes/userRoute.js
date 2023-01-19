const express = require('express');
const router = express.Router();
const { registerValidation } = require('../validations/validations');
const { registerUser, getOneUser, updateUser } = require('../controllers/userController.js');

router
  .get('/:id', getOneUser)
  .post('/', registerValidation, registerUser)
  .patch('/:id', updateUser)

module.exports = router;