const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Incorrect data', errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const doc = new User({
      email: req.body.email,
      username: req.body.username,
      avatarUrl: req.body.avatarUrl,
      password: hashedPassword
    })

    const user = await doc.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: "Could not register"
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) res.status(404).json({ message: 'Could not find' });

    const { password, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not log in",
    });
  }
};

const changeUserData = (req, res) => {};

const deleteUser = (req, res) => {};

module.exports = {
  registerUser,
  getOneUser,
  changeUserData,
  deleteUser
};