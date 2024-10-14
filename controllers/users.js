const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const {
  okStatusCode,
  createdStatusCode,
  badRequestStatusCode,
  internalServerError,
  notFoundStatusCode,
  confilctErrorCode,
  unathorizedErrorCode,
} = require("../utils/status-codes");
// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(okStatusCode).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(() => res.status(createdStatusCode).send({ name, avatar, email }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.name === 11000) {
        return res
          .status(confilctErrorCode)
          .send({ message: "Duplicate error" });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "An error has occurred on the server" }); // return res.status(badRequestStatusCode).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Document not found" });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      // return the token to the client
      res.send({ token });
    })
    .catch((err) => {
      if (err === "Incorrect email or password") {
        return res
          .status(unathorizedErrorCode)
          .send({ message: "Authorized required" });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Document not found" });
      }
      if (err === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    { id: req.user._id },
    { name: req.body.name, avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err === "ValidationError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(internalServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};
