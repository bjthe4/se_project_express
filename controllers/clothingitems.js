const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingitem");
const {
  okStatusCode,
  notFoundStatusCode,
  createdStatusCode,
} = require("../utils/status-codes");

const { BadRequestError } = require("../middlewares/BadRequestError");
const { NotFoundStatusError } = require("../middlewares/NotFoundStatusError");
const { InternalServerCode } = require("../middlewares/InternalServerCode");
const { ForbiddenError } = require("../middlewares/ForbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  // // pass req.user._id as the owner
  // const { name, weather, imageUrl, owner } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((newItem) => res.status(createdStatusCode).send(newItem))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Error from createItem"));
      }
      return next(new InternalServerCode("Error from createItem"));
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(okStatusCode).send(items))
    .catch((err) => {
      console.error(err);
      next(new InternalServerCode("Error from getItems"));
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

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(BadRequestError("Invalid ID format"));
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
        return next(new NotFoundStatusError("Document not found"));
      }
      if (err.name === "ForbiddenError") {
        return next(new ForbiddenError("Access forbidden"));
      }
      return next(new InternalServerCode("Error from likeItem"));
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid ID format"));
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
          return next(new BadRequestError("Error from likeItem"));
        }

        if (err.name === "DocumentNotFoundError") {
          return next(new NotFoundStatusError("Document not found"));
        }
        return next(new InternalServerCode("Error from likeItem"));
      })
  );
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid ID format"));
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
        return next(new BadRequestError("Error from dislikeItem"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundStatusError("Document not found"));
      }
      return next(new InternalServerCode("Error from dislikeItem"));
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
