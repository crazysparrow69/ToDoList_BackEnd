const express = require('express');
const router = express.Router();
const { registerValidation, updateUserValidation } = require('../validations/validations');
const { createUser, getOneUser, updateUser, deleteUser, getAllUsers } = require('../controllers/userController.js');

router
  .get('/:id', getOneUser)
  .get('/', getAllUsers)
  .post('/', registerValidation, createUser)
  .patch('/:id', updateUserValidation, updateUser)
  .delete('/:id', deleteUser);

module.exports = router;