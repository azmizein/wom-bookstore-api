const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { sequelize } = require("./src/models");
const { errorHandler } = require("./src/middleware/errorHandler");
const redisClient = require("./src/config/redis");

const app = express();

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);

const {
  authRoutes,
  bookRoutes,
  cartRoutes,
  checkoutRoutes,
  adminRoutes,
} = require("./src/routes");

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "WOM Finance Book Store API",
    version: "1.0.0",
  });
});

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();

    sequelize.sync({ alter: true });

    await redisClient.ping();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", async () => {
  await sequelize.close();
  await redisClient.quit();
  process.exit(0);
});

start();
