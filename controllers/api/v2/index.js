const router = require("express").Router();
const redis = require("../../../config/redis");
const categoryRoutes = require("./categories");
const productRoutes = require("./products");
const reviewRoutes = require("./reviews");

router.use(async (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "private, max-age=300");

    const cache = await redis.get(req.originalUrl);

    if (cache) {
      res.status(200).json(JSON.parse(cache));
      return;
    }
  }

  next();
});

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
