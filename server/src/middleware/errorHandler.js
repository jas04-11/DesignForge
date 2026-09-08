const ApiError = require("../utils/ApiError");

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid identifier: ${err.value}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // MongoDB connection / server errors
  if (err.name === "MongoServerError" || err.name === "MongooseServerSelectionError") {
    statusCode = 503;
    message = "Database is currently unavailable. Please try again shortly.";
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details,
  });
}

module.exports = { notFoundHandler, errorHandler };
