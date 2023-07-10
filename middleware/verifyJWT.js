const jwt = require('jsonwebtoken');
const User = require("../models/User");

const verifyJWT = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (!token) return res.status(403).json({ message: 'No access' });

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = await User.findById(decoded._id);
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = verifyJWT;