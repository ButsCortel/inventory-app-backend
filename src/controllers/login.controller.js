const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await pool.query("SELECT * FROM accounts WHERE email=$1", [
        email,
      ]);
      if (
        user.rows[0] &&
        (await bcrypt.compare(password, user.rows[0].password))
      ) {
        const {
          user_id,
          firstname,
          lastname,
          email,
          isverified,
        } = user.rows[0];
        const userResponse = {
          user_id,
          email,
          firstname,
          lastname,
          isverified,
        };
        const token = jwt.sign(userResponse, process.env.SECRET_KEY);
        return res.json({ user_id, token });
      }
      return res.status(401).json("Email or password does not match");
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },
};
