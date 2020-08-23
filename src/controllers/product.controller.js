const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const unlinkAsync = promisify(fs.unlink);

const pool = require("../config/db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}

module.exports = {
  async createProduct(req, res) {
    try {
      const {
        creator,
        name,
        description,
        price,
        qrcode,
        stock,
        category,
        last_user,
      } = req.body;
      const { filename } = req.file;
      const thumbnail_url = `${process.env.BACKEND}/productImages/${filename}`;
      const newProduct = await pool.query(
        "INSERT INTO products (creator, name, description, price, qrcode, stock, thumbnail, thumbnail_url, category, last_user) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) RETURNING *",
        [
          creator,
          name,
          description,
          price,
          qrcode,
          stock,
          filename,
          thumbnail_url,
          category,
          last_user,
        ]
      );
      res.json(newProduct.rows[0]);
    } catch (error) {
      await unlinkAsync(req.file.path);
      res.status(400).json(error.message);
    }
  },
  async getProducts(req, res) {
    try {
      const allProducts = await pool.query("SELECT * FROM products");
      if (!allProducts.rows[0])
        return res.status(400).json("No products available!");
      res.json(allProducts.rows);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  async getProductById(req, res) {
    try {
      const product = await pool.query(
        "SELECT * FROM products WHERE p_id= $1",
        [req.params.id]
      );
      if (!product.rows[0])
        return res.status(400).json("Product does not exist!");
      res.json(product.rows[0]);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  async getProductsByCategory(req, res) {
    try {
      const product = await pool.query(
        "SELECT * FROM products WHERE category= $1",
        [req.params.category]
      );
      if (product.rows[0])
        return res.status(400).json("Product does not exist!");
      res.json(product.rows[0]);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      for await (const [key, value] of Object.entries(req.body)) {
        await pool.query(`UPDATE products SET ${key} = $1 WHERE p_id = $2`, [
          value,
          id,
        ]);
      }
      res.json("Product was updated!");
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const productToDelete = await pool.query(
        "SELECT thumbnail FROM products WHERE p_id =$1",
        [id]
      );
      //DELETE PRODUCT IMAGE
      await unlinkAsync(
        path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "productImages",
          productToDelete.rows[0].thumbnail
        )
      );
      await pool.query("DELETE FROM products WHERE p_id = $1", [id]);
      res.json("Product was deleted!");
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
};
