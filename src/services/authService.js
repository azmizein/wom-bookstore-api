const { User, Cart } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { AppError } = require("../helpers/response");
const redisClient = require("../config/redis");
const { v4: uuidv4 } = require("uuid");

class AuthService {
  async register(data) {
    const { name, email, password, role = "customer" } = data;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (role === "customer") {
      await Cart.create({ userId: user.id });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(email, password, deviceId) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const currentDeviceId = deviceId || uuidv4();

    const existingToken = await redisClient.get(`user:${user.id}:token`);
    if (existingToken && user.deviceId && user.deviceId !== currentDeviceId) {
      await redisClient.del(`user:${user.id}:token`);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await redisClient.setEx(`user:${user.id}:token`, 3600, token);

    await user.update({
      deviceId: currentDeviceId,
      lastLoginAt: new Date(),
    });

    return {
      token,
      deviceId: currentDeviceId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId) {
    await redisClient.del(`user:${userId}:token`);
    await User.update({ deviceId: null }, { where: { id: userId } });

    return true;
  }
}

module.exports = new AuthService();
