const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const PORT = process.env.PORT || 8000;

const app = express();

//TODO: Create product
//TODO: CRUD on product

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}

try {
  mongoose.connect(process.env.MONGO_DB_SECRET_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log("DB Connected successfully");
} catch (error) {
  throw Error(`Error while connecting to DB: ${error}`);
}

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
