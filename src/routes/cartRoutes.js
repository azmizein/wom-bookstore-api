const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { auth, roleCheck } = require("../middleware/auth");

router.use(auth, roleCheck("customer"));
router.get("/", cartController.getCart);
router.post("/items", cartController.addToCart);
router.delete("/items/:id", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

module.exports = router;
