const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET);
};

// Login user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
    next(error);
  }
};

const signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.signup(name, email, password);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
    next(error);
  }
};

module.exports = { loginUser, signupUser };
