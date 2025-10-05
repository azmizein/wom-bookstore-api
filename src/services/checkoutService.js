const {
  Transaction,
  TransactionItem,
  Cart,
  CartItem,
  Book,
  sequelize,
} = require("../models");
const { AppError } = require("../helpers/response");
const { Op } = require("sequelize");
const transaction = require("../models/transaction");

class CheckoutService {
  generateTransactionNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `TRX${timestamp}${random}`;
  }

  async checkout(userId, paymentMethod) {
    const transaction = await sequelize.transaction();

    try {
      const cart = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [
              {
                model: Book,
                as: "book",
                where: { isActive: true },
              },
            ],
          },
        ],
        transaction,
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new AppError("Cart is empty", 400);
      }

      const bookIds = cart.items.map((item) => item.bookId);
      const books = await Book.findAll({
        where: {
          id: { [Op.in]: bookIds },
          isActive: true,
        },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      const bookMap = new Map(books.map((b) => [b.id, b]));

      for (const item of cart.items) {
        const book = bookMap.get(item.bookId);
        if (!book) {
          throw new AppError(
            `Book ${item.book.title} is no longer available`,
            400
          );
        }
        if (book.stock < item.quantity) {
          throw new AppError(`Insufficient stock for ${book.title}`, 400);
        }
      }

      let totalAmount = 0;
      const transactionItems = [];

      for (const item of cart.items) {
        const book = bookMap.get(item.bookId);
        const subtotal = parseFloat(book.price) * item.quantity;
        totalAmount += subtotal;

        transactionItems.push({
          bookId: item.bookId,
          quantity: item.quantity,
          price: book.price,
          subtotal,
        });

        await book.update(
          { stock: book.stock - item.quantity },
          { transaction }
        );
      }

      const newTransaction = await Transaction.create(
        {
          transactionNumber: this.generateTransactionNumber(),
          userId,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          status: "pending",
          paymentMethod,
        },
        { transaction }
      );

      for (const item of transactionItems) {
        await TransactionItem.create(
          {
            transactionId: newTransaction.id,
            ...item,
          },
          { transaction }
        );
      }

      await CartItem.destroy({
        where: { cartId: cart.id },
        transaction,
      });

      await transaction.commit();

      const result = await Transaction.findByPk(newTransaction.id, {
        include: [
          {
            model: TransactionItem,
            as: "items",
            include: [
              {
                model: Book,
                as: "book",
              },
            ],
          },
        ],
      });

      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updatePaymentStatus(transactionNumber, status) {
    const validStatuses = ["pending", "success", "failed"];

    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid payment status", 400);
    }

    const transaction = await Transaction.findOne({
      where: { transactionNumber },
    });

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    const updateData = { status };
    if (status === "success") {
      updateData.paidAt = new Date();
    }

    await transaction.update(updateData);

    return transaction;
  }

  async getTransactions(userId = null, filters = {}) {
    const where = {};

    if (userId) {
      where.userId = userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: TransactionItem,
          as: "items",
          include: [
            {
              model: Book,
              as: "book",
            },
          ],
        },
        {
          model: require("../models").User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return transactions;
  }

  async getTransactionById(id, userId = null) {
    const where = { id };

    if (userId) {
      where.userId = userId;
    }

    const transaction = await Transaction.findOne({
      where,
      include: [
        {
          model: TransactionItem,
          as: "items",
          include: [
            {
              model: Book,
              as: "book",
            },
          ],
        },
      ],
    });

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    return transaction;
  }
}

module.exports = new CheckoutService();
