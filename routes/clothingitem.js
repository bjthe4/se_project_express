const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitems");

// crud

// read

router.get("/", getItems);

// update
router.use(auth);

// create
router.post("/", createItem);

// router.put("/:itemId", updateItem);

// Like
router.put("/:itemId/likes", likeItem);

// delete

router.delete("/:itemId", deleteItem);

// disLike
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
