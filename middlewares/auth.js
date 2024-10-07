const JWT_SECRET = require("../utils/config");
const jwt = require("jsonwebtoken");
const { unathorizedErrorCode } = require("../utils/status-codes");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(unathorizedErrorCode)
      .send({ message: "Authorization Required" });
  }
  const token = authorization.replace("Bearer", "");
  let payload;

  try {
    payload = jwt.vertify(token, "some-secret-key");
  } catch (err) {
    return res
      .status(unathorizedErrorCode)
      .send({ message: "Authorization Required" });
  }
  req.user = payload;

  next();
};
