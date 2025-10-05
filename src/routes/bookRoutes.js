const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { auth } = require("../middleware/auth");

router.use(auth);
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookById);

module.exports = router;
