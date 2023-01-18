const express = require("express");
const router = express.Router();
const { handleAuth } = require("../controllers/authController.js");
const { authValidation } = require('../validations/validations');

router.post("/", authValidation, handleAuth);

module.exports = router;
