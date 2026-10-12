function healthChecker(req, res, next) {
  return res.status(200).json({
    success: true,
    message: "Api running successfully",
    status: "OK",
  });
}

export { healthChecker };
