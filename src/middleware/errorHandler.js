const { ErrorLog } = require("../models");
const { AppError, errorResponse } = require("../helpers/response");

const errorHandler = async (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = "Validation error";
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return errorResponse(res, message, statusCode, errors);
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Duplicate entry";
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: `${e.path} already exists`,
    }));
    return errorResponse(res, message, statusCode, errors);
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  try {
    await ErrorLog.create({
      userId: req.user?.userId || null,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      errorMessage: message,
      errorStack: err.stack,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip || req.connection.remoteAddress,
    });
  } catch (logError) {
    console.error("Failed to log error:", logError);
  }

  return errorResponse(res, message, statusCode);
};

module.exports = {
  errorHandler,
};
