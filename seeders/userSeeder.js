const { User } = require("../src/models");

const users = [
  {
    name: "Admin User",
    email: "admin@womfinance.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: "customer123",
    role: "customer",
  },
];

const userSeeder = async () => {
  try {
    console.log("Seeding users...");

    for (const userData of users) {
      await User.create(userData);
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    console.log(`Successfully seeded ${users.length} users`);
  } catch (error) {
    console.error("User seeder failed:", error);
    throw error;
  }
};

module.exports = userSeeder;
