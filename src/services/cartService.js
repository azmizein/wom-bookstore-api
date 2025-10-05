const { Cart, CartItem, Book, sequelize } = require("../models");
const { AppError } = require("../helpers/response");

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({
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
    });

    if (!cart) {
      cart = await Cart.create({ userId });
      cart.items = [];
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    return {
      cart,
      total: parseFloat(total.toFixed(2)),
    };
  }

  async addToCart(userId, bookId, quantity) {
    const transaction = await sequelize.transaction();

    try {
      const book = await Book.findOne({
        where: { id: bookId, isActive: true },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!book) {
        throw new AppError("Book not found", 404);
      }

      if (book.stock < quantity) {
        throw new AppError("Insufficient stock", 400);
      }

      let cart = await Cart.findOne({
        where: { userId },
        transaction,
      });

      if (!cart) {
        cart = await Cart.create({ userId }, { transaction });
      }

      const existingItem = await CartItem.findOne({
        where: { cartId: cart.id, bookId },
        transaction,
      });

      let cartItem;
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (book.stock < newQuantity) {
          throw new AppError("Insufficient stock", 400);
        }

        cartItem = await existingItem.update(
          { quantity: newQuantity },
          { transaction }
        );
      } else {
        cartItem = await CartItem.create(
          {
            cartId: cart.id,
            bookId,
            quantity,
            price: book.price,
          },
          { transaction }
        );
      }

      await transaction.commit();

      const result = await CartItem.findByPk(cartItem.id, {
        include: [
          {
            model: Book,
            as: "book",
          },
        ],
      });

      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeFromCart(userId, cartItemId) {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new AppError("Item not found in cart", 404);
    }

    await cartItem.destroy();

    return true;
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ where: { userId } });

    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }

    return true;
  }
}

module.exports = new CartService();
