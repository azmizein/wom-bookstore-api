const checkoutService = require("../services/checkoutService");
const { successResponse } = require("../helpers/response");
const {
  checkoutSchema,
  paymentCallbackSchema,
  transactionQuerySchema,
  transactionParamSchema,
} = require("../validations/checkoutValidations");

class CheckoutController {
  async checkout(req, res, next) {
    try {
      const { error, value } = checkoutSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const transaction = await checkoutService.checkout(
        req.user.userId,
        value.paymentMethod
      );
      return successResponse(res, transaction, "Checkout successful", 200);
    } catch (error) {
      next(error);
    }
  }

  async paymentCallback(req, res, next) {
    try {
      const { error, value } = paymentCallbackSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const transaction = await checkoutService.updatePaymentStatus(
        value.transactionId,
        value.status
      );
      return successResponse(
        res,
        transaction,
        "Payment status updated successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getMyTransactions(req, res, next) {
    try {
      const { error, value } = transactionQuerySchema.validate(req.query, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const transactions = await checkoutService.getTransactions(
        req.user.userId,
        value
      );
      return successResponse(
        res,
        transactions,
        "Transactions retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req, res, next) {
    try {
      const { error, value } = transactionParamSchema.validate(req.params, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const transaction = await checkoutService.getTransactionById(
        value.id,
        req.user.userId
      );
      return successResponse(
        res,
        transaction,
        "Transaction retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllTransactions(req, res, next) {
    try {
      const { error, value } = transactionQuerySchema.validate(req.query, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const transactions = await checkoutService.getTransactions(null, value);
      return successResponse(
        res,
        transactions,
        "All transactions retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CheckoutController();
