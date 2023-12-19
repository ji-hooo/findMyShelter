import { StatusCodes } from "http-status-codes";

function errorMiddleware(error, req, res, next) {
  console.log("\x1b[33m%s\x1b[0m", error);
  res.status(StatusCodes.NOT_FOUND).json({
    result: "fail",
    error: `Page not found ${req.path}`,
  });
}

export default errorMiddleware;
