const express = require("express");
const multer = require("multer");
const routes = express.Router();
//const imageHandler = require("./config/imageHelper");
const UserController = require("./controllers/user.controller");
const ProductController = require("./controllers/product.controller");
const verifyToken = require("./config/verifiyToken");
const LoginController = require("./controllers/login.controller");

const uploadConfig = require("./config/upload");
const upload = multer(uploadConfig);
//const HistoryController = require("./controllers/HistoryController");

// const multer = Multer({
//   storage: Multer.MemoryStorage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
//   },
// });
// routes.get("/history/:productId?", verifyToken, HistoryController.getHistory);
// //PRODUCTS

// routes.post(
//   "/products/upload",
//   verifyToken,
//   multer.single("image"),
//   imageHandler.upload,
//   ProductController.addProduct
// );
// routes.post(
//   "/products/:productId/update",
//   verifyToken,
//   ProductController.updateProduct
// );
// routes.delete(
//   "/products/:productId/delete",
//   verifyToken,
//   ProductController.deleteProduct,
//   imageHandler.deleteImage
// );

// routes.get(
//   "/products/categories/:category?",
//   verifyToken,
//   ProductController.getProductsByCategory
// );
// routes.get(
//   "/products/:productId",
//   verifyToken,
//   ProductController.getProductById
// );

// routes.get("/products", verifyToken, ProductController.getProducts);

// //USERS

// routes.post("/register", UserController.createUser);
// routes.post("/login", LoginController.login);
routes.delete(
  "/products/delete/:id",
  verifyToken,
  ProductController.deleteProduct
);
routes.put(
  "/products/update/:id",
  verifyToken,
  ProductController.updateProduct
);
routes.post(
  "/products/create",
  verifyToken,
  upload.single("thumbnail"),
  ProductController.createProduct
);
routes.get(
  "/products/category/:category?",
  verifyToken,
  ProductController.getProductsByCategory
);
routes.get("/products/:id", verifyToken, ProductController.getProductById);
routes.get("/products", verifyToken, ProductController.getProducts);

routes.post("/accounts/create", UserController.createUser);

routes.post("/login", LoginController.login);

module.exports = routes;
