const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// const routes = require("./routes");
// app.use(routes);

// const routes = require("./routes");
app.use(express.json());
// app.use((req, res, next) => {
//   req.user = { _id: "66edabab98b2cf09fed78b0a" };
//   next();
// });
// app.use(routes);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});
