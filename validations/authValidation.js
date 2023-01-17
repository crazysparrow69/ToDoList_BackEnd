const { body } = require('express-validator');

const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('username').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL()
];

module.exports = { registerValidation };