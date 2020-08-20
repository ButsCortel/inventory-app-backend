const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  dateCreated: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  action: {
    type: String,
    enum: ["DELETE", "INCOMING", "OUTGOING", "NEW", "UPDATE"],
    default: "NEW",
  },
  description: { type: String, default: "No description added." },
});

module.exports = mongoose.model("History", HistorySchema);
