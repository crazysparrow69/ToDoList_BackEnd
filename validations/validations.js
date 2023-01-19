const { body } = require('express-validator');

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

const updateUserValidation = [
  body('email', 'Incorrect email').optional().isEmail(),
  body('password', 'Incorrect password').optional().isLength({ min: 5 }),
  body('username', 'Incorrect username').optional().isLength({ min: 3 }),
  body('avatarUrl', 'Incorrect avatarUrl').optional().isURL()
];

module.exports = { 
  registerValidation,
  authValidation,
  updateUserValidation
 };