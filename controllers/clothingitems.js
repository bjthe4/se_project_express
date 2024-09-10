const ClothingItem = require("../models/clothingitem");

const createItem = (req, res) => {
  console.log(res);
  console.log(req.body);

  const name = ({ name, weather, avatar } = req.body);
  ClothingItem.create({ name, weather, imageUrl }).then();
};
