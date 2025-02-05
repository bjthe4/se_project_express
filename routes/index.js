const router = require("express").Router();

const userRouter = require("./users");

const clothingItem = require("./clothingitem");

// const { notFoundStatusCode } = require("../utils/status-codes");

const { login, createUser } = require("../controllers/users");

// const { validateId, validateCardBody } = require("../middlewares/validation");

const { NotFoundStatusError } = require("../middlewares/NotFoundStatusError");

const {
  validateUserSignUp,
  validateUserSignIn,
} = require("../middlewares/validation");

router.post("/signin", validateUserSignIn, login);
router.post("/signup", validateUserSignUp, createUser);

router.use("/users", userRouter);

router.use("/items", clothingItem);

router.use((req, res, next) => {
  next(new NotFoundStatusError("Router not found"));
});

module.exports = router;
