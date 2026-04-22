import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
        expiresIn: "30d",
    });
};
export const registerUser = async (req, res) => {
    const { role, firstName, lastName, name, email, password, university, department, } = req.body;
    const normalizedFirstName = String(firstName || "").trim();
    const normalizedLastName = String(lastName || "").trim();
    const normalizedName = String(name || `${normalizedFirstName} ${normalizedLastName}`).trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedUniversity = String(university || "").trim();
    const normalizedDepartment = String(department || "").trim();
    if (!normalizedFirstName ||
        !normalizedLastName ||
        !normalizedName ||
        !normalizedEmail ||
        !password ||
        !normalizedUniversity ||
        !normalizedDepartment) {
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
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                university: user.university,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Server error",
        });
    }
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                university: user.university,
                department: user.department,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=authController.js.map