const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || "An unexpected error occured";

  res.status(statusCode).json({
    sucess: false,
    error: {
      message,
      // Optionally include the stack trace in development mode
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
