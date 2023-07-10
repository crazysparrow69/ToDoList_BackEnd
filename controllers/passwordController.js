const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const verifyPass = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });

    const user = await User.findOne({ _id: req.user._id.toString() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPass)
      return res.status(404).json({ message: "Invalid password" });

    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { verifyPass };
