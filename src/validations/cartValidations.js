const Joi = require("joi");

const addToCartSchema = Joi.object({
  bookId: Joi.number().integer().required().messages({
    "any.required": "Book ID is required",
    "number.base": "Book ID must be a number",
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
});

const removeFromCartSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    "any.required": "Cart item ID is required",
    "number.base": "Cart item ID must be a number",
  }),
});

module.exports = {
  addToCartSchema,
  removeFromCartSchema,
};
