const router = require("express").Router();

const auth = require("../middlewares/auth");

const { validateId, validateCardBody } = require("../middlewares/validation");

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
router.post("/", validateCardBody, createItem);

// router.put("/:itemId", updateItem);

// Like
router.put("/:itemId/likes", validateId, likeItem);

// delete

router.delete("/:itemId", validateId, deleteItem);

// disLike
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
