const router = require("express").Router();

const userRouter = require("./users");

const clothingItem = require("./clothingitem");

const { notFoundStatusCode } = require("../utils/status-codes");

const { login, createUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(notFoundStatusCode).send({ message: "Router not found" });
});

module.exports = router;
