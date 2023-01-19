const express = require('express');
const router = express.Router();
const { registerValidation, updateUserValidation } = require('../validations/validations');
const { createUser, getOneUser, updateUser, deleteUser, getAllUsers } = require('../controllers/userController.js');
const verifyJWT = require('../middleware/verifyJWT');

router
  .get('/:id', verifyJWT, getOneUser)
  .get('/', getAllUsers)
  .post('/', registerValidation, createUser)
  .patch('/:id', verifyJWT, updateUserValidation, updateUser)
  .delete('/:id', verifyJWT, deleteUser);

module.exports = router;