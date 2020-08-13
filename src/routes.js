const express = require("express");
const Multer = require("multer");
const routes = express.Router();
const imageHandler = require("./config/imageHelper");
const UserController = require("./controllers/UserController");
const ProductController = require("./controllers/ProductController");
const verifyToken = require("./config/verifiyToken");
const LoginController = require("./controllers/LoginController");

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
});

//PRODUCTS

routes.post(
  "/products/upload",
  verifyToken,
  multer.single("image"),
  imageHandler.upload,
  ProductController.addProduct
);
routes.post(
  "/products/:productId/update",
  verifyToken,
  ProductController.updateProduct
);
routes.delete(
  "/products/:productId/delete",
  verifyToken,
  ProductController.deleteProduct,
  imageHandler.deleteImage
);

routes.get(
  "/products/categories/:category?",
  verifyToken,
  ProductController.getProductsByCategory
);
routes.get(
  "/products/:productId",
  verifyToken,
  ProductController.getProductById
);

routes.get("/products", verifyToken, ProductController.getProducts);

//USERS

routes.post("/register", UserController.createUser);
routes.post("/login", LoginController.login);

module.exports = routes;
