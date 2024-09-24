const ClothingItem = require("../models/clothingitem");
const {
  okStatusCode,
  noContentStatusCode,
  badRequestStatusCode,
  notFoundStatusCode,
  internalServerError,
  createdStatusCode,
} = require("../utils/status-codes");
const mongoose = require("mongoose");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  // // pass req.user._id as the owner
  // const { name, weather, imageUrl, owner } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((card) => res.status(createdStatusCode).send({ card }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Error from createItem" });
      }
      res
        .status(internalServerError)
        .send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(okStatusCode).send(items))
    .catch((err) => {
      console.error(err);
      res.status(internalServerError).send({ message: "Error from getItems" });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail()
//     .then((item) => res.status(okStatusCode).send({ data: item }))
//     .catch((err) => {
//       console.error(err);
//       res
//         .status(internalServerError)
//         .send({ message: "Error from updateItem" });
//     });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "Invalid ID format" });
  }

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(noContentStatusCode).send({}))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Document not found" });
      }
      res.status(internalServerError).send({ message: "Error from likeItem" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((likes) => {
      if (!likes) {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Item not found" });
      }
      res.send(likes);
    })
    .catch((error) => {
      console.log("Like item error", error);
      if (error.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Error from likeItem", error });
      }
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Document not found", error });
      }
      res.status(internalServerError).send({ message: "Error from likeItem" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((likes) => {
      if (!likes) {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Item not found" });
      }
      res.send(likes);
    })
    .catch((error) => {
      console.log("Like item error", error);
      if (error.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Error from dislikeItem", error });
      }
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Document not found", error });
      }
      res
        .status(internalServerError)
        .send({ message: "Error from dislikeItem" });
    });
};

module.exports = {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
