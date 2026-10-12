function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode >= 500 ? "Something broke!" : err.message || "Request failed";
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
}

export default errorHandler;
