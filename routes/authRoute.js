const express = require("express");
const router = express.Router();
const { handleAuth } = require("../controllers/authController.js");

router.post("/", handleAuth);

module.exports = router;
