const express = require("express");
const router = express.Router();
const { taskValidation } = require("../validations/validations");
const verifyJWT = require("../middleware/verifyJWT");
const { createTask } = require("../controllers/taskController");

router.post("/", verifyJWT, taskValidation, createTask);

module.exports = router;
