const { Sequelize } = require("sequelize");
const config = require("../config/database");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Book = require("./book")(sequelize, Sequelize);
db.Cart = require("./cart")(sequelize, Sequelize);
db.CartItem = require("./cartItem")(sequelize, Sequelize);
db.Transaction = require("./transaction")(sequelize, Sequelize);
db.TransactionItem = require("./transactionItem")(sequelize, Sequelize);
db.ErrorLog = require("./errorLog")(sequelize, Sequelize);

// Define relationships
// User - Cart (1:1)
db.User.hasOne(db.Cart, { foreignKey: "userId", as: "cart" });
db.Cart.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// Cart - CartItem (1:N)
db.Cart.hasMany(db.CartItem, { foreignKey: "cartId", as: "items" });
db.CartItem.belongsTo(db.Cart, { foreignKey: "cartId", as: "cart" });

// Book - CartItem (1:N)
db.Book.hasMany(db.CartItem, { foreignKey: "bookId", as: "cartItems" });
db.CartItem.belongsTo(db.Book, { foreignKey: "bookId", as: "book" });

// User - Transaction (1:N)
db.User.hasMany(db.Transaction, { foreignKey: "userId", as: "transactions" });
db.Transaction.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// Transaction - TransactionItem (1:N)
db.Transaction.hasMany(db.TransactionItem, {
  foreignKey: "transactionId",
  as: "items",
});
db.TransactionItem.belongsTo(db.Transaction, {
  foreignKey: "transactionId",
  as: "transaction",
});

// Book - TransactionItem (1:N)
db.Book.hasMany(db.TransactionItem, {
  foreignKey: "bookId",
  as: "transactionItems",
});
db.TransactionItem.belongsTo(db.Book, { foreignKey: "bookId", as: "book" });

module.exports = db;
