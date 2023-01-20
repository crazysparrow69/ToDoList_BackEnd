const express = require("express");
const router = express.Router();
const { createTaskValidation } = require("../validations/validations");
const verifyJWT = require("../middleware/verifyJWT");
const { createTask } = require("../controllers/taskController");

router.post("/", verifyJWT, createTaskValidation, createTask);

module.exports = router;
