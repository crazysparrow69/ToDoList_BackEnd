const express = require("express");
const router = express.Router();
// const {
//   registerValidation,
//   updateUserValidation,
// } = require("../validations/validations");
const {
  createCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/categoryController.js");
const verifyJWT = require("../middleware/verifyJWT");

router
  .get("/:id", verifyJWT, getOneCategory)
  .get("/", verifyJWT, getCategories)
  .post("/", verifyJWT, createCategory)
  .patch("/:id", verifyJWT, updateCategory)
  .delete("/:id", verifyJWT, deleteCategory);

module.exports = router;