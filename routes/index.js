const router = require("express").Router();

const userRouter = require("./users");

const clothingItem = require("./clothingitem.js");

const { internalServerError } = require("../utils/status-codes");

router.use("/users", userRouter);

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(internalServerError).send({ message: "Router not found" });
});

module.exports = router;
