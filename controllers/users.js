const User = require("../models/user");
const {
  okStatusCode,
  createdStatusCode,
  badRequestStatusCode,
  internalServerError,
} = require("../utils/status-codes");
//GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(okStatusCode).res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(internalServerError).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(createdStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequestStatusCode).send({ message: err.message });
      }
      return res.status(internalServerError).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(badRequestStatusCode).send({ message: err.message });
      }
      return res.status(internalServerError).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
