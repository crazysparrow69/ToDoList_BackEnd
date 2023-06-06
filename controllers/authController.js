const User = require("../models/User");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const handleAuth = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPass)
      return res.status(404).json({ message: "Invalid email or password" });

    const token = Jwt.sign(
      {
        _id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    const { password, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Cannot find user",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  handleAuth,
  getMe,
};
