const mongoose = require("mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}

const ProductSchema = new mongoose.Schema(
  {
    dateCreated: { type: Date, default: Date.now },
    name: String,
    price: Number,
    stock: Number,
    thumbnail: String,
    category: String,
    lastModification: Date,
    lastUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

ProductSchema.virtual("thumbnail_url").get(function () {
  return process.env.BUCKET_URL + this.thumbnail;
});

module.exports = mongoose.model("Products", ProductSchema);
