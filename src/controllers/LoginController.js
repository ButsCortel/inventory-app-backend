const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: `Required Field/s missing!`,
        });
      }
      const user = await User.findOne({
        email,
      }).select("+password");
      if (!user) {
        return res.status(401).json({
          message: "Email or password does not match",
        });
      }
      if (user && (await bcrypt.compare(password, user.password))) {
        const userResponse = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        };
        //return res.json(userResponse);
        const token = jwt.sign(userResponse, process.env.SECRET_KEY);

        return res.header("auth-token", token).sendStatus(200);
      } else {
        return res.status(401).json({
          message: "Email or password does not match",
        });
      }
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
