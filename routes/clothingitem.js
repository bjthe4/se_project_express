const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitems");

//crud

//create
router.post("/", createItem);

//read

router.get("/", getItems);

//update

router.put("/:itemId", updateItem);

//Like
router.put("/items/:ItemId/likes", likeItem);

//delete

router.delete("/:itemId", deleteItem);

//disLike
router.delete("/items/:ItemId/likes", dislikeItem);

module.exports = router;
