const router = require("express").Router;

const { createItem } = require("../controllers/clothingitems");

//crud

//create
router.post("/", createItem);

//read

router.get("/", getItems);

//update

//delete

module.exports = router;
