const { body } = require('express-validator');
const User = require("../models/User");

const registerValidation = [
  body('email', 'Incorrect email').isEmail(),
  body('password', 'Incorrect password').isLength({ min: 5 }),
  body('username', 'Incorrect username').isLength({ min: 3 }),
  body('avatarUrl', 'Incorrect avatarUrl').optional().isURL()
];

const authValidation = [
  body('email', 'Incorrect email').isEmail(),
  body('password', 'Incorrect password').isLength({ min: 5 }),
];

module.exports = { 
  registerValidation,
  authValidation
 };