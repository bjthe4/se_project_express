const router = require("express").Router();

const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitems");

// crud

// create
router.post("/", createItem);

// read

router.get("/", getItems);

// update

// router.put("/:itemId", updateItem);

// Like
router.put("/:itemId/likes", likeItem);

// delete

router.delete("/:itemId", deleteItem);

// disLike
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
