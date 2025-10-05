const { verifyToken } = require("../helpers/jwt");
const { AppError } = require("../helpers/response");
const redisClient = require("../config/redis");
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);

    const storedToken = await redisClient.get(`user:${decoded.userId}:token`);

    if (!storedToken || storedToken !== token) {
      throw new AppError("Invalid session. Please login again", 401);
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError("Access denied. Insufficient permissions", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  auth,
  roleCheck,
};
