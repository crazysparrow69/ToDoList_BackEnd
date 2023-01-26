const express = require("express");
const router = express.Router();
const { handleAuth, getMe } = require("../controllers/authController.js");
const verifyJWT = require("../middleware/verifyJWT.js");
const { authValidation } = require("../validations/validations");

router.post("/", authValidation, handleAuth).get("/me", verifyJWT, getMe);

module.exports = router;
