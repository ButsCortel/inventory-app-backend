const pool = require("../config/db");
const bcrypt = require("bcrypt");

module.exports = {
  async createUser(req, res) {
    try {
      const { firstname, lastname, password, email } = req.body;
      const hashedPass = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO accounts (firstname, lastname, password, email) VALUES($1,$2,$3,$4) RETURNING *",
        [firstname, lastname, hashedPass, email]
      );

      res.json("Account created successfully!");
    } catch (error) {
      console.log(error);
      res.status(400).json(error.detail);
    }
  },
};
