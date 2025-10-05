const cartService = require("../services/cartService");
const { successResponse } = require("../helpers/response");
const {
  addToCartSchema,
  removeFromCartSchema,
} = require("../validations/cartValidations");

class CartController {
  async getCart(req, res, next) {
    try {
      const result = await cartService.getCart(req.user.userId);
      return successResponse(res, result, "Cart retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req, res, next) {
    try {
      const { error, value } = addToCartSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const cartItem = await cartService.addToCart(
        req.user.userId,
        value.bookId,
        value.quantity
      );

      return successResponse(
        res,
        cartItem,
        "Item added to cart successfully",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const { error, value } = removeFromCartSchema.validate(req.params, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      await cartService.removeFromCart(req.user.userId, value.id);
      return successResponse(res, null, "Item removed from cart successfully");
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      await cartService.clearCart(req.user.userId);
      return successResponse(res, null, "Cart cleared successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
