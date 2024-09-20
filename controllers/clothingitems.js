const ClothingItem = require("../models/clothingitem");
const {
  okStatusCode,
  noContentStatusCode,
  badRequestStatusCode,
  notFoundStatusCode,
  internalServerError,
} = require("../utils/status-codes");
const mongoose = require("mongoose");

const createItem = (req, res) => {
  console.log(res);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res
        .status(badRequestStatusCode)
        .send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(okStatusCode).send(items))
    .catch((e) => {
      res
        .status(internalServerError)
        .send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(okStatusCode).send({ data: item }))
    .catch((e) => {
      res
        .status(internalServerError)
        .send({ message: "Error from updateItem", e });
    });
};

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
    .catch((e) => {
      res
        .status(notFoundStatusCode)
        .send({ message: "Error from deleteItem", e });
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
    .then((item) => {
      if (!item) {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Item not found" });
      }
      res.send(item);
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
    .then((item) => {
      if (!item) {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Item not found" });
      }
      res.send(item);
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
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
