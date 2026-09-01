import { Request, Response } from "express";
import User from "../models/User.js";
import LearningActivity from "../models/LearningActivity.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetEmail } from "../utils/emailService.js";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "2h",
  });
};

const buildUserResponse = (user: any) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: user.name,
  email: user.email,
  role: user.role,
  university: user.university,
  department: user.department,
  phoneNumber: user.phoneNumber,
  jobTitle: user.jobTitle,
  location: user.location,
  website: user.website,
  points: user.points,
  badges: user.badges,
  bio: user.bio,
  profilePhoto: user.profilePhoto,
});

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    role,
    firstName,
    lastName,
    name,
    email,
    password,
    university,
    department,
  } = req.body;

  const normalizedFirstName = String(firstName || "").trim();
  const normalizedLastName = String(lastName || "").trim();
  const normalizedName = String(
    name || `${normalizedFirstName} ${normalizedLastName}`,
  ).trim();
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const normalizedUniversity = String(university || "").trim();
  const normalizedDepartment = String(department || "").trim();

  if (
    !normalizedFirstName ||
    !normalizedLastName ||
    !normalizedName ||
    !normalizedEmail ||
    !password ||
    !normalizedUniversity ||
    !normalizedDepartment
  ) {
    res.status(400).json({ message: "Please fill all required fields" });
    return;
  }

  try {
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      role: role || "Student",
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      university: normalizedUniversity,
      department: normalizedDepartment,
    });

    if (user) {
      res.status(201).json({
        ...buildUserResponse(user),
        token: generateToken(user._id as unknown as string),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  try {
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // Log authentication session event
      await LearningActivity.create({
        student: user._id,
        activityType: 'login',
        title: 'User Login Session',
        details: 'User authenticated successfully',
        timestamp: new Date()
      }).catch(err => console.error("Failed to log login activity", err));

      res.json({
        ...buildUserResponse(user),
        token: generateToken(user._id as unknown as string),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.body;
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedEmail) {
    res.status(400).json({ message: "Please provide an email address" });
    return;
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(404).json({
        message: "No account exists with that email address.",
      });
      return;
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry

    await user.save();

    console.log(`DIRECT PASSWORD RESET REQUEST FOR: ${user.email}`);
    console.log(`Reset Token: ${resetToken}`);


    res.status(200).json({
      message: "Password reset token generated successfully.",
      token: resetToken,
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: "Token and new password are required" });
    return;
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res
        .status(400)
        .json({ message: "Invalid or expired password reset token" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};
