const authService = require("../services/authService");
const { successResponse } = require("../helpers/response");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidations");

class AuthController {
  async register(req, res, next) {
    try {
      const { error, value } = registerSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const user = await authService.register(value);
      return successResponse(res, user, "User registered successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { error, value } = loginSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const result = await authService.login(
        value.email,
        value.password,
        value.deviceId
      );
      return successResponse(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      await authService.logout(req.user.userId);
      return successResponse(res, null, "Logout successful");
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      return successResponse(res, req.user, "User profile retrieved");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
