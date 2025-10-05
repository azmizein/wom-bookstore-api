const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { auth, roleCheck } = require("../middleware/auth");

router.post("/", auth, roleCheck("customer"), checkoutController.checkout);

router.post("/callback", checkoutController.paymentCallback);
router.get(
  "/transactions",
  auth,
  roleCheck("customer"),
  checkoutController.getMyTransactions
);
router.get(
  "/transactions/:id",
  auth,
  roleCheck("customer"),
  checkoutController.getTransactionById
);

module.exports = router;
