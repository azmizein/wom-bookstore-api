const Joi = require("joi");

const checkoutSchema = Joi.object({
  paymentMethod: Joi.string().trim().required().messages({
    "any.required": "Payment method is required",
    "string.empty": "Payment method cannot be empty",
  }),
});

const paymentCallbackSchema = Joi.object({
  transactionId: Joi.number().integer().required().messages({
    "any.required": "Transaction ID is required",
    "number.base": "Transaction ID must be a number",
  }),
  status: Joi.string()
    .valid("pending", "paid", "failed", "cancelled")
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be one of: pending, paid, failed, cancelled",
    }),
});

const transactionQuerySchema = Joi.object({
  status: Joi.string()
    .valid("pending", "paid", "failed", "cancelled")
    .optional(),
});

const transactionParamSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    "any.required": "Transaction ID is required",
    "number.base": "Transaction ID must be a number",
  }),
});

module.exports = {
  checkoutSchema,
  paymentCallbackSchema,
  transactionQuerySchema,
  transactionParamSchema,
};
