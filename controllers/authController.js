const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleAuth = async (req, res) => {
  try {
    if (!req.body.email)
      return res.status(400).json({ message: "Email required" });
    if (!req.body.password)
      return res.status(400).json({ message: "Password required" });
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({ message: "Invalid login or password" });
    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPass)
      return res.status(404).json({ message: "Invalid email or password" });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not log in",
    });
  }
  res.end();
};

module.exports = {
  handleAuth,
};
