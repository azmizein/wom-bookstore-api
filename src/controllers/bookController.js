const bookService = require("../services/bookService");
const { successResponse } = require("../helpers/response");
const {
  createBookSchema,
  updateStockSchema,
  getBooksQuerySchema,
} = require("../validations/bookValidations");

class BookController {
  async getBooks(req, res, next) {
    try {
      const { error, value } = getBooksQuerySchema.validate(req.query, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const books = await bookService.getBooks(req.user.role, value);
      return successResponse(res, books, "Books retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getBookById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await bookService.getBookById(id, req.user.role);

      return successResponse(res, book, "Book retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async createBook(req, res, next) {
    try {
      const { error, value } = createBookSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const book = await bookService.createBook(value);
      return successResponse(res, book, "Book created successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = updateStockSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }

      const book = await bookService.updateStock(
        id,
        value.quantity,
        value.operation
      );
      return successResponse(res, book, "Stock updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteBook(req, res, next) {
    try {
      const { id } = req.params;
      await bookService.deleteBook(id);

      return successResponse(res, null, "Book deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async getSalesReport(req, res, next) {
    try {
      const report = await bookService.getSalesReport();
      return successResponse(
        res,
        report,
        "Sales report retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
