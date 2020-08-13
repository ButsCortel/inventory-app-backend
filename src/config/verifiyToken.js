const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ message: "Unauthorized!" });
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

module.exports = verifyToken;
