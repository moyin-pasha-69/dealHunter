function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  console.log(err.code, err);
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  } else if (err.code === 11000) {
    statusCode = 409;
    const field =
      Object.keys(err.keyPattern || {})[0] ||
      Object.keys(err.keyValue || {})[0];

    message = `${field} already Exist` || "Duplicated Value";
  }
  console.log(statusCode, message);
  err.status = err.status || "error";
  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
}

export default errorHandler;
