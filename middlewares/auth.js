const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { unathorizedErrorCode } = require("../utils/status-codes");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(unathorizedErrorCode)
      .send({ message: "Authorization Required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(unathorizedErrorCode)
      .send({ message: "Authorization Required" });
  }
  req.user = payload;

  return next();
};

module.exports = auth;
