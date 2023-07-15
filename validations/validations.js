const { body, param } = require("express-validator");
const Category = require("../models/Category");
const Task = require("../models/Task");

const registerValidation = [
  body("email", "Incorrect email").isEmail(),
  body("firstPass")
    .isLength({ min: 5, max: 20 })
    .withMessage("Password should be 5-20 characters long")
    .isAlphanumeric()
    .withMessage("Password should only consist of numbers and letters"),
  body("login")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username should be 3-20 characters long")
    .isAlphanumeric()
    .withMessage("Username should only consist of numbers and letters"),
];

const authValidation = [
  body("email", "Incorrect email").isEmail(),
  body("password")
    .isLength({ min: 5, max: 20 })
    .withMessage("Password should be 5-20 characters long")
    .isAlphanumeric()
    .withMessage("Password should only consist of numbers and letters"),
];

const updateUserValidation = [
  body("email", "Incorrect email").optional().isEmail(),
  body("password")
    .optional()
    .isLength({ min: 5, max: 20 })
    .withMessage("Password should be 5-20 characters long")
    .isAlphanumeric()
    .withMessage("Password should only consist of numbers and letters"),
  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username should be 3-20 characters long")
    .isAlphanumeric()
    .withMessage("Username should only consist of numbers and letters"),
  body("avatarUrl", "Incorrect avatarUrl").optional(),
];

const createTaskValidation = [
  body("title")
    .isString()
    .withMessage("Title should be string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Title should be 3-50 characters long"),
  body("description")
    .isString()
    .withMessage("Description should be string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Description should be 3-200 characters long"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories should be array"),
  body("deadline", "For deadline use Date").optional().isString(),
  body("isCompleted", "isCompleted must be boolean").optional().isBoolean(),
  body("links", "Links must be an array of links")
    .optional()
    .isArray()
    .custom((arr) => {
      arr.forEach((elem) => {
        const url = new URL(elem);
        if (!url) return false;
      });
      return true;
    }),
];

const updateTaskValidation = [
  param("id", "Requires id of the task").custom(async (value) => {
    const foundTask = await Task.findById(value);
    return foundTask ? true : false;
  }).withMessage("Task does not exist"),
  body("title")
    .optional()
    .isString()
    .withMessage("Title should be string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Title should be 3-50 characters long"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description should be string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Description should be 3-200 characters long"),
  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories should be array"),
  body("deadline", "For deadline use Date").optional().isString(),
  body("isCompleted", "isCompleted must be boolean").optional().isBoolean(),
  body("links", "Links must be an array of links")
    .optional()
    .isArray()
    .custom((arr) => {
      arr.forEach((elem) => {
        const url = new URL(elem);
        if (!url) return false;
      });
      return true;
    }),
];

const shareTaskValidation = [
  body(
    "shareTo",
    "Requires id of the user you want to share the task with"
  ).isString(),
];

const createCategoryValidation = [
  body("title")
    .isString()
    .withMessage("Title should be string")
    .isLength({ min: 3, max: 20 })
    .withMessage("Title should be 3-20 characters long"),
  body("color")
    .isString()
    .withMessage("Color should be string")
    .isLength({ max: 20 })
    .withMessage("Color should be maximum 20 characters long"),
];

const updateCategoryValidation = [
  param("id", "Requires id of the category")
    .custom(async (value) => {
      const foundCategory = await Category.findById(value);
      return foundCategory ? true : false;
    })
    .withMessage("Category does not exist"),
  body("title")
    .optional()
    .isString()
    .withMessage("Title should be string")
    .isLength({ min: 3, max: 20 })
    .withMessage("Title should be 3-20 characters long"),
  body("color")
    .optional()
    .isString()
    .withMessage("Color should be string")
    .isLength({ max: 20 })
    .withMessage("Color should be maximum 20 characters long"),
];

const verifyPassValidation = [
  body("password")
    .isLength({ min: 5, max: 20 })
    .withMessage("Password should be 5-20 characters long")
    .isAlphanumeric()
    .withMessage("Password should only consist of numbers and letters"),
];

module.exports = {
  registerValidation,
  authValidation,
  updateUserValidation,
  createTaskValidation,
  updateTaskValidation,
  shareTaskValidation,
  createCategoryValidation,
  updateCategoryValidation,
  verifyPassValidation,
};
