const mongoose = require("mongoose");

const UserRequestSchema = new mongoose.Schema({
  dateCreated: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("UserRequests", UserRequestSchema);
