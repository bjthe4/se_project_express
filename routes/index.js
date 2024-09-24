const router = require("express").Router();

const userRouter = require("./users");

const clothingItem = require("./clothingitem");

const { notFoundStatusCode } = require("../utils/status-codes");

router.use("/users", userRouter);

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(notFoundStatusCode).send({ message: "Router not found" });
});

module.exports = router;
