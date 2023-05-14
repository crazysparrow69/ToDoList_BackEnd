const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT.js");
const { saveImage, getImage } = require("../controllers/imageController.js");

router.get("/", verifyJWT, getImage)
      .post("/", verifyJWT, saveImage);

module.exports = router;
