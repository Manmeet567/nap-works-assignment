const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  if (!authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token must start with Bearer" });
  }

  const token = authorization.split(" ")[1];

  try {
    // Verify the token
    const { _id } = jwt.verify(token, process.env.SECRET);

    // find user based on _id from token and attach to req object
    req.user = await User.findOne({ _id }).select("_id");
    if (!req.user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
