const Joi = require("joi");

const createBookSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  author: Joi.string().min(2).max(255).required(),
  isbn: Joi.string().max(100).optional(),
  description: Joi.string().optional().allow(""),
  price: Joi.number().precision(2).min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  publisher: Joi.string().optional().allow(""),
  publishedYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  category: Joi.string().optional().allow(""),
});

const updateStockSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  operation: Joi.string().valid("add", "subtract").required(),
});

const getBooksQuerySchema = Joi.object({
  category: Joi.string().optional(),
  search: Joi.string().optional(),
});

module.exports = {
  createBookSchema,
  updateStockSchema,
  getBooksQuerySchema,
};
