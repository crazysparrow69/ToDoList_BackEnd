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
      message: "Internal server error",
    });
  }
};

const updateUser = async (req, res) => {
  try {

    let hashedPassword = undefined;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt); 
    }
    await User.updateOne(
      {
        _id: req.params.id
      },
      {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        avatarUrl: req.body.avatarUrl
      }
    );

    res.json({ message: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not update",
    });
  }
};

const deleteUser = (req, res) => {};

module.exports = {
  registerUser,
  getOneUser,
  updateUser,
  deleteUser
};