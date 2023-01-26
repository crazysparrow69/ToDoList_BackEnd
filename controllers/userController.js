const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ message: "Could not find" });

    const { password, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not find" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not find" });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const doc = new User({
      email: req.body.email,
      username: req.body.username,
      avatarUrl: req.body.avatarUrl,
      password: hashedPassword,
    });

    const user = await doc.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Could not register" });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Incorrect data", errors: errors.array() });

    let hashedPassword = undefined;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        avatarUrl: req.body.avatarUrl,
      }
    );

    res.json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not update" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });

    if (!user) return res.status(404).json({ message: "Could not find" });

    res.json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not delete" });
  }
};

module.exports = {
  getOneUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
