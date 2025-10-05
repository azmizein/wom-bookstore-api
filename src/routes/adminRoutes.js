const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const checkoutController = require("../controllers/checkoutController");
const { auth, roleCheck } = require("../middleware/auth");

router.use(auth, roleCheck("admin"));

router.post("/books", bookController.createBook);
router.patch("/books/:id/stock", bookController.updateStock);
router.delete("/books/:id", bookController.deleteBook);
router.get("/transactions", checkoutController.getAllTransactions);
router.get("/reports/sales", bookController.getSalesReport);

module.exports = router;
