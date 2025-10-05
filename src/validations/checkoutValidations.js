const Joi = require("joi");

const checkoutSchema = Joi.object({
  paymentMethod: Joi.string().trim().required().messages({
    "any.required": "Payment method is required",
    "string.empty": "Payment method cannot be empty",
  }),
});

const paymentCallbackSchema = Joi.object({
  transactionNumber: Joi.string().required().messages({
    "any.required": "Transaction ID is required",
    "number.base": "Transaction ID must be a number",
  }),
  status: Joi.string()
    .valid("pending", "success", "failed")
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be one of: pending, success, failed",
    }),
});

const transactionQuerySchema = Joi.object({
  status: Joi.string().valid("pending", "success", "failed").optional(),
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
