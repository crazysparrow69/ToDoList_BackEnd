const express = require("express");
const router = express.Router();
const { createTaskValidation } = require("../validations/validations");
const verifyJWT = require("../middleware/verifyJWT");
const {
  createTask,
  getAllTasks,
  getTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", verifyJWT, createTaskValidation, createTask);
router.get("/", getAllTasks);
router.get("/:id", getTask);
router.delete("/:id", deleteTask);

module.exports = router;
