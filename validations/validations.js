const { body } = require("express-validator");

const registerValidation = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Incorrect password").isLength({ min: 5 }),
  body("username", "Incorrect username").isLength({ min: 3 }),
  body("avatarUrl", "Incorrect avatarUrl").optional().isURL(),
];

const authValidation = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Incorrect password").isLength({ min: 5 }),
];

const updateUserValidation = [
  body("email", "Incorrect email").optional().isEmail(),
  body("password", "Incorrect password").optional().isLength({ min: 5 }),
  body("username", "Incorrect username").optional().isLength({ min: 3 }),
  body("avatarUrl", "Incorrect avatarUrl").optional().isURL(),
];

const createTaskValidation = [
  body("title", "Enter title").isString().isLength({ min: 3 }),
  body("description", "Enter description").isString().isLength({ min: 3 }),
  body("categories", "Categories must be array").optional().isArray(),
  body("deadline", "For deadline use Date").optional().isDate(),
  body("isCompleted", "isCompleted must be boolean").optional().isBoolean(),
];

const updateTaskValidation = [
  body("title", "Enter title").optional().isString().isLength({ min: 3 }),
  body("description", "Enter description")
    .optional()
    .isString()
    .isLength({ min: 3 }),
  body("categories", "Categories must be array").optional().isArray(),
  body("deadline", "For deadline use Date").optional().isDate(),
  body("isCompleted", "isCompleted must be boolean").optional().isBoolean(),
];

const createCategoryValidation = [
  body("title", "Enter title").isString().isLength({ min: 3 }),
  body("color", "Enter color").isString().isLength({ min: 3 }),
];

const updateCategoryValidation = [
  body("title", "Enter title").isString().isLength({ min: 3 }).optional(),
  body("color", "Enter color").isString().isLength({ min: 3 }).optional(),
];

module.exports = {
  registerValidation,
  authValidation,
  updateUserValidation,
  createTaskValidation,
  updateTaskValidation,
  createCategoryValidation,
  updateCategoryValidation,
};
