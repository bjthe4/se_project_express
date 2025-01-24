const { JWT_SECRET = "helloworld456" } = process.env;

console.log(JWT_SECRET);
module.exports = {
  JWT_SECRET,
};
