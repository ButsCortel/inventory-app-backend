const Product = require("../models/Product");
const User = require("../models/User");
const History = require("../models/History");

module.exports = {
  async addProduct(req, res) {
    const { name, price, stock, category } = req.body;
    const { _id } = req.user;
    const { filename } = req.file;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User does not exist!" });
    }
    if (!req.file || !filename) {
      return res.status(500).send("Unable to upload");
    }
    try {
      const product = await Product.create({
        name,
        price,
        stock,
        thumbnail: filename,
        category,
        lastModification: new Date(),
        lastUser: user._id,
        user: user._id,
      });
      await History.create({
        user: user._id,
        product: product._id,
      });
      // await product.populate("lastUser").populate("user").execPopulate();
      // await history.populate("user").populate("product").execPopulate();

      return res.sendStatus(200);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  },
  async getProducts(req, res) {
    try {
      const result = await Product.find();
      // products.map(
      //   async (product) =>
      //     await product.populate("lastUser").populate("user").execPopulate()
      // );
      //await products.populate("lastUser").populate("user").execPopulate()
      const promises = result.map(
        async (product) =>
          await product.populate("lastUser").populate("user").execPopulate()
      );
      const products = await Promise.all(promises);
      return res.json(products);
    } catch (error) {
      return res.status(400).json({
        message: "There are no available products yet.",
      });
    }
  },
  async getProductsByCategory(req, res) {
    const { category } = req.params;

    const query = category === undefined ? {} : { category };

    try {
      const result = await Product.find(query);
      console.log;
      if (!result.length)
        //check if result has content
        return res.status(400).json({
          message: "There are no available products!",
        });
      // products.map(
      //   async (product) =>
      //     await product.populate("lastUser").populate("user").execPopulate()
      // );
      //await products.populate("lastUser").populate("user").execPopulate()
      const promises = result.map(
        async (product) =>
          await product.populate("lastUser").populate("user").execPopulate()
      );
      const products = await Promise.all(promises);
      return res.json(products);
    } catch (error) {
      return res.status(400).json({
        message: "There are no available products yet.",
      });
    }
  },
  async getProductById(req, res) {
    const { productId } = req.params;

    if (productId) {
      try {
        const product = await Product.findById(productId);
        await product.populate("lastUser").populate("user").execPopulate();

        if (product) return res.json(product);
      } catch (error) {
        return res.status(400).json({ message: "Product does not exist!" });
      }
    }
    return res.status(400).json({ message: "Product does not exist!" });
  },
  async deleteProduct(req, res, next) {
    const { productId } = req.params;
    try {
      const product = await Product.findByIdAndDelete(productId);
      await History.create({
        user: user._id,
        product: product._id,
        action: "DELETE",
      });
      req.filename = product.thumbnail;
      next();
    } catch (error) {
      return res
        .status(400)
        .json({ message: `Product id ${productId} does not exist!` });
    }
  },
  async updateProduct(req, res) {
    const { name, price, stock, category } = req.body;
    const { _id } = req.user;
    const { productId } = req.params;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User does not exist!" });
    }
    try {
      const product = await Product.findOneAndUpdate(
        { _id: productId },
        {
          name,
          price,
          stock,
          category,
          lastModification: new Date(),
          lastUser: user._id,
        },
        (err, data) => {
          if (err) return res.status(500).json(error);
          else if (!data) return res.status(500);
        }
      );
      await History.create({
        user: user._id,
        product: product._id,
        action: "UPDATE",
      });
      await product.populate("lastUser").populate("user").execPopulate();
      return res.json(product);
    } catch (error) {
      return res.status(400).json({ message: "Product does not exist!" });
    }
  },
  async updateProductImage(req, res) {
    const { _id } = req.user;
    const { productId } = req.params;
    const { filename } = req.file;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User does not exist!" });
    }
    if (!req.file || !filename) {
      return res.status(500).send("Unable to upload");
    }
    try {
      const product = await Product.findOneAndUpdate(
        { _id: productId },
        {
          thumbnail: filename,
          lastModification: new Date(),
          lastUser: user._id,
        },
        (err, data) => {
          if (err) return res.status(500).json(error);
          else if (!data) return res.status(500);
        }
      );
      await History.create({
        user: user._id,
        product: product._id,
        action: "UPDATE",
      });
      await product.populate("lastUser").populate("user").execPopulate();
      return res.json(product);
    } catch (error) {
      return res.status(400).json({ message: "Product does not exist!" });
    }
  },
};
