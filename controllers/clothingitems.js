const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingitem");
const {
  okStatusCode,
  badRequestStatusCode,
  notFoundStatusCode,
  internalServerError,
  createdStatusCode,
  forbiddenErrorCode,
} = require("../utils/status-codes");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  // // pass req.user._id as the owner
  // const { name, weather, imageUrl, owner } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then(() =>
      res.status(createdStatusCode).send({ name, weather, imageUrl, owner })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Error from createItem" });
      }
      return res
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
  return ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = notFoundStatusCode;
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        const error = new Error();
        error.name = "ForbiddenError";
        throw error;
      }
      return item
        .deleteOne()
        .then((deletedItem) => res.status(okStatusCode).send(deletedItem));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Document not found" });
      }
      if (err.name === "ForbiddenError") {
        return res
          .status(forbiddenErrorCode)
          .send({ message: "Access forbidden" });
      }
      return res
        .status(internalServerError)
        .send({ message: "Error from likeItem" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "Invalid ID format" });
  }

  return (
    ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
      { new: true }
    )
      .orFail()
      .then((likes) => res.send(likes))
      // if (!likes) {
      //   return res
      //     .status(notFoundStatusCode)
      //     .send({ message: "Item not found" });
      // }
      .catch((err) => {
        console.error(err);
        if (err.name === "CastError") {
          return res
            .status(badRequestStatusCode)
            .send({ message: "Error from likeItem" });
        }

        if (err.name === "DocumentNotFoundError") {
          return res
            .status(notFoundStatusCode)
            .send({ message: "Document not found" });
        }
        return res
          .status(internalServerError)
          .send({ message: "Error from likeItem" });
      })
  );
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = notFoundStatusCode;
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((likes) => {
      if (!likes) {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Item not found" });
      }
      return res.send(likes);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Error from dislikeItem" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Document not found" });
      }
      return res
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
