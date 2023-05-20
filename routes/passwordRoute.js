const express = require("express");
const router = express.Router();
const { verifyPass } = require("../controllers/passwordController.js");
const verifyJWT = require("../middleware/verifyJWT.js");
const { verifyPassValidation } = require('../validations/validations');

router.post("/", verifyJWT, verifyPassValidation, verifyPass);

module.exports = router;