const express = require("express");
const router = express.Router();
const {
  createTaskValidation,
  updateTaskValidation,
} = require("../validations/validations");
const verifyJWT = require("../middleware/verifyJWT");
const {
  createTask,
  getAllTasks,
  getTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

router.post("/", verifyJWT, createTaskValidation, createTask);
router.get("/", getAllTasks);
router.get("/:id", getTask);
router.delete("/:id", verifyJWT, deleteTask);
router.patch("/:id", verifyJWT, updateTaskValidation, updateTask);

module.exports = router;
