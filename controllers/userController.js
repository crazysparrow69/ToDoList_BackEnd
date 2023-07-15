const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ message: "Could not find" });

    const { password, ...userData } = user._doc;
    
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });

    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser)
      return res.status(400).json({ message: "You already have account" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.firstPass, salt);

    const doc = new User({
      email: req.body.email,
      username: req.body.login,
      password: hashedPassword,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    const { password, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });

    let hashedPassword = null;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = {
      username: req.body.username,
      email: req.body.email,
    };

    if (hashedPassword) updatedUser.password = hashedPassword;

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      updatedUser
    );

    if (!user)
      return res.status(404).json({ message: "Could not find the user" });

    res.json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });

    if (!user) return res.status(404).json({ message: "Could not find" });

    res.json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getOneUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
