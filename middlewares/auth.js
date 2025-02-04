const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
// const { unathorizedErrorCode } = require("../utils/status-codes");
const { UnathorizedError } = require("./UnathorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnathorizedError("Authorization Required"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return next(new UnathorizedError("Authorization Required"));
  }
  req.user = payload;

  return next();
};

module.exports = auth;
