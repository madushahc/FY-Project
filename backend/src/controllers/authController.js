"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
  return jsonwebtoken_1.default.sign(
    { id },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "30d",
    },
  );
};
const registerUser = async (req, res) => {
  const { name, email, password, department, university } = req.body;
  try {
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash(password, salt);
    const user = await User_1.default.create({
      name,
      email,
      passwordHash,
      department,
      university,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,

        department: user.department,
        university: user.university,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User_1.default.findOne({ email });
    if (
      user &&
      (await bcryptjs_1.default.compare(password, user.passwordHash))
    ) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        university: user.university,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.loginUser = loginUser;
//# sourceMappingURL=authController.js.map
