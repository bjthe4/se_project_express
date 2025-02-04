class NoContentError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 204;
  }
}

module.exports = { NoContentError };
