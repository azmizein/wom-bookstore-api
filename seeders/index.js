const { sequelize } = require("../src/models");
const userSeeder = require("./userSeeder");
const bookSeeder = require("./bookSeeder");

const runSeeders = async () => {
  try {
    console.log("🌱 Starting seeders...");

    await sequelize.authenticate();
    console.log("✓ Database connected");

    await sequelize.sync({ force: true });
    console.log("✓ Database synchronized");

    await userSeeder();
    await bookSeeder();

    console.log("✓ All seeders completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;
