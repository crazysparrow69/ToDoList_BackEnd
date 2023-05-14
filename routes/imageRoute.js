const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT.js");
const {saveImage} = require("../controllers/imageController.js");

router.post("/", verifyJWT, saveImage);

module.exports = router;