const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { okStatusCode, createdStatusCode } = require("../utils/status-codes");
const { BadRequestError } = require("../middlewares/BadRequestError");
const { InternalServerCode } = require("../middlewares/InternalServerCode");
const { ConfilctError } = require("../middlewares/ConfilctError");
const { UnathorizedError } = require("../middlewares/UnathorizedError");
const { NotFoundStatusError } = require("../middlewares/NotFoundStatusError");

// GET /users

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(okStatusCode).send(users))
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(internalServerError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(() => res.status(createdStatusCode).send({ name, avatar, email }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("An error has occurred on the server"));
      }
      if (err.code === 11000) {
        return next(new ConfilctError("Duplicate error"));
      }
      return next(
        new InternalServerCode("An error has occurred on the server")
      );
    });
};

// const getUser = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(okStatusCode).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "CastError") {
//         return res
//           .status(badRequestStatusCode)
//           .send({ message: "An error has occurred on the server" }); // return res.status(badRequestStatusCode).send({ message: err.message });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(notFoundStatusCode)
//           .send({ message: "Document not found" });
//       }
//       return res
//         .status(internalServerError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestError("The password and email fields are required")
    );
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      // return the token to the client
      res.send({
        token,
        user: {
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnathorizedError("Authorized required"));
      }
      return next(
        new InternalServerCode("An error has occurred on the server")
      );
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err === "DocumentNotFoundError") {
        return next(new NotFoundStatusError("Document not found"));
      }
      if (err === "CastError") {
        return next(new BadRequestError()).send({
          message: "An error has occurred on the server",
        });
      }
      return next(
        new InternalServerCode("An error has occurred on the server")
      );
    });
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("An error has occurred on the server"));
      }
      return next(
        new InternalServerCode("An error has occurred on the server")
      );
    });
};

module.exports = {
  // getUsers,
  createUser,
  // getUser,
  login,
  getCurrentUser,
  updateProfile,
};
