const ClothingItem = require("../models/clothingitem");

const createItem = (req, res) => {
  console.log(res);
  console.log(req.body);

  const name = ({ name, weather, imageUrl } = req.body);
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  clothingitem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

module.exports = { createItem, getItems };
