const { Book, TransactionItem } = require("../models");
const { AppError } = require("../helpers/response");
const { Op } = require("sequelize");

class BookService {
  async getBooks(role, filters = {}) {
    const where = { isActive: true };

    if (role === "customer") {
      where.stock = { [Op.gt]: 0 };
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${filters.search}%` } },
        { author: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    const books = await Book.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return books;
  }

  async getBookById(id, role) {
    const where = { id, isActive: true };

    if (role === "customer") {
      where.stock = { [Op.gt]: 0 };
    }

    const book = await Book.findOne({ where });

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return book;
  }

  async createBook(data) {
    const {
      title,
      author,
      isbn,
      description,
      price,
      stock,
      publisher,
      publishedYear,
      category,
    } = data;

    // Check if ISBN already exists
    if (isbn) {
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        throw new AppError("Book with this ISBN already exists", 409);
      }
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      description,
      price,
      stock,
      publisher,
      publishedYear,
      category,
    });

    return book;
  }

  async updateStock(id, quantity, operation = "add") {
    const book = await Book.findOne({
      where: { id, isActive: true },
    });

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    let newStock;
    if (operation === "add") {
      newStock = book.stock + quantity;
    } else if (operation === "subtract") {
      newStock = book.stock - quantity;
      if (newStock < 0) {
        throw new AppError("Insufficient stock", 400);
      }
    } else {
      throw new AppError("Invalid operation", 400);
    }

    await book.update({ stock: newStock });

    return book;
  }

  async deleteBook(id) {
    const book = await Book.findByPk(id);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    // Soft delete
    await book.update({ isActive: false });

    return true;
  }

  async getSalesReport() {
    const books = await Book.findAll({
      where: { isActive: true },
      include: [
        {
          model: TransactionItem,
          as: "transactionItems",
          attributes: ["quantity", "price", "subtotal"],
          include: [
            {
              model: require("../models").Transaction,
              as: "transaction",
              where: { status: "success" },
              attributes: [],
            },
          ],
        },
      ],
    });

    const report = books.map((book) => {
      const soldQuantity = book.transactionItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const totalRevenue = book.transactionItems.reduce(
        (sum, item) => sum + parseFloat(item.subtotal),
        0
      );

      return {
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: parseFloat(book.price),
        soldQuantity,
        remainingStock: book.stock,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      };
    });

    return report;
  }
}

module.exports = new BookService();
