const express = require("express");
const router = express.Router();
const {
  createTaskValidation,
  updateTaskValidation,
  shareTaskValidation
} = require("../validations/validations");
const verifyJWT = require("../middleware/verifyJWT");
const {setTaskQueryParams} = require("../middleware/setQueryParams");
const {
  createTask,
  getAllTasks,
  getTask,
  deleteTask,
  updateTask,
  shareTask,
  getTaskStats
} = require("../controllers/taskController");

router.post("/", verifyJWT, createTaskValidation, createTask)
      .get("/", verifyJWT, setTaskQueryParams, getAllTasks)
      .get("/stats", verifyJWT, getTaskStats)
      .get("/:id", verifyJWT, getTask)
      .delete("/:id", verifyJWT, deleteTask)
      .patch("/:id", verifyJWT, updateTaskValidation, updateTask)
      .post("/share/:id", verifyJWT, shareTaskValidation, shareTask)

module.exports = router;
