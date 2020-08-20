const History = require("../models/History");

module.exports = {
  async getHistory(req, res) {
    const { productId } = req.params;

    try {
      const query = productId ? { productId } : {};

      const result = await History.find(query);
      if (!result.length)
        //check if result has content
        return res.status(400).json({
          message: "No records available!",
        });
      // products.map(
      //   async (product) =>
      //     await product.populate("lastUser").populate("user").execPopulate()
      // );
      //await products.populate("lastUser").populate("user").execPopulate()
      const promises = result.map(
        async (history) =>
          await history.populate("user").populate("product").execPopulate()
      );
      const history = await Promise.all(promises);
      return res.json(history);
    } catch (error) {
      return res.status(400).json({
        message: "There are no records available.",
      });
    }
  },
};
