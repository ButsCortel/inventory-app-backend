const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  dateCreated: { type: Date, default: Date.now },
  firstName: String,
  lastName: String,
  email: String,
  password: { type: String, select: false },
  isVerified: { type: Boolean, default: false },
  accessToken: { type: String, select: false },
});

module.exports = mongoose.model("Users", UserSchema);
