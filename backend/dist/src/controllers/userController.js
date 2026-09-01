import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Enrollment from "../models/Enrollment.js";
import Submission from "../models/Submission.js";
import QuizAttempt from "../models/QuizAttempt.js";
import ForumPost from "../models/ForumPost.js";
// @desc    Get all users
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select("-passwordHash")
            .sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Any authenticated user)
export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const latestUser = await User.findById(user._id).select("-passwordHash");
        res.json(latestUser);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (Any authenticated user)
export const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        // Extract fields to update, explicitly ignoring 'role' and 'passwordHash'
        const { name, email, university, department, bio, phoneNumber, jobTitle, location, website, } = req.body;
        if (name) {
            const trimmedName = String(name).trim();
            if (trimmedName) {
                user.name = trimmedName;
                // Keep first/last name in sync, but do not blank lastName for single-word names.
                const nameParts = trimmedName.split(/\s+/).filter(Boolean);
                if (nameParts.length >= 2) {
                    user.firstName = nameParts[0];
                    user.lastName = nameParts.slice(1).join(" ");
                }
                else if (nameParts.length === 1) {
                    user.firstName = nameParts[0];
                }
            }
        }
        if (email)
            user.email = String(email).trim().toLowerCase();
        if (university)
            user.university = String(university).trim();
        if (department)
            user.department = String(department).trim();
        if (bio !== undefined)
            user.bio = String(bio);
        if (phoneNumber !== undefined)
            user.phoneNumber = String(phoneNumber).trim();
        if (jobTitle !== undefined)
            user.jobTitle = String(jobTitle).trim();
        if (location !== undefined)
            user.location = String(location).trim();
        if (website !== undefined)
            user.website = String(website).trim();
        if (req.file) {
            // @ts-ignore
            user.profilePhoto = `/uploads/${req.file.filename}`;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            university: updatedUser.university,
            department: updatedUser.department,
            phoneNumber: updatedUser.phoneNumber,
            jobTitle: updatedUser.jobTitle,
            location: updatedUser.location,
            website: updatedUser.website,
            points: updatedUser.points,
            // @ts-ignore
            bio: updatedUser.bio,
            // @ts-ignore
            profilePhoto: updatedUser.profilePhoto,
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        if (error?.code === 11000 && error?.keyPattern?.email) {
            res.status(409).json({ message: "Email already exists" });
            return;
        }
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }
    if (!currentPassword || !newPassword) {
        res.status(400).json({ message: "Current and new passwords are required" });
        return;
    }
    if (newPassword.length < 6) {
        res.status(400).json({ message: "New password must be at least 6 characters long" });
        return;
    }
    try {
        // Re-fetch user to include passwordHash since middleware excludes it
        const fullUser = await User.findById(user._id);
        if (!fullUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = await bcrypt.compare(currentPassword, fullUser.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: "Incorrect current password" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        fullUser.passwordHash = await bcrypt.hash(newPassword, salt);
        await fullUser.save();
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({
            message: error instanceof Error ? error.message : "Server error",
        });
    }
};
// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Admin
export const createUser = async (req, res) => {
    try {
        const { role, firstName, lastName, name, email, password, university, department, phoneNumber, jobTitle, location, website, bio } = req.body;
        if (!firstName || !lastName || !email || !password || !university || !department) {
            res.status(400).json({ message: "Please fill all required fields" });
            return;
        }
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            role: role || "Student",
            firstName,
            lastName,
            name: name || `${firstName} ${lastName}`,
            email: email.toLowerCase(),
            passwordHash,
            university,
            department,
            phoneNumber: phoneNumber || "",
            jobTitle: jobTitle || "",
            location: location || "",
            website: website || "",
            bio: bio || ""
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// @desc    Update any user (Admin only)
// @route   PUT /api/users/:id
// @access  Admin
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { role, firstName, lastName, name, email, university, department, phoneNumber, jobTitle, location, website, bio } = req.body;
        if (role)
            user.role = role;
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (name) {
            user.name = name;
        }
        else if (firstName || lastName) {
            user.name = `${firstName || user.firstName} ${lastName || user.lastName}`;
        }
        if (email)
            user.email = email.toLowerCase();
        if (university)
            user.university = university;
        if (department)
            user.department = department;
        if (phoneNumber !== undefined)
            user.phoneNumber = phoneNumber;
        if (jobTitle !== undefined)
            user.jobTitle = jobTitle;
        if (location !== undefined)
            user.location = location;
        if (website !== undefined)
            user.website = website;
        if (bio !== undefined)
            user.bio = bio;
        const updatedUser = await user.save();
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// @desc    Get student profile quick stats
// @route   GET /api/users/profile/stats
// @access  Private (Student)
export const getStudentStats = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        // 1. Courses Enrolled
        const coursesEnrolled = await Enrollment.countDocuments({ student: userId });
        // 2. Assignments Submitted
        const assignmentsSubmitted = await Submission.countDocuments({ student: userId });
        // 3. Quizzes Attempted
        const quizzesAttempted = await QuizAttempt.countDocuments({ student: userId });
        // 4. Forum Contributions
        const forumPostsCount = await ForumPost.countDocuments({ author: userId });
        const forumRepliesCount = await ForumPost.countDocuments({ "replies.author": userId });
        const forumPosts = forumPostsCount + forumRepliesCount;
        res.json({
            coursesEnrolled,
            assignmentsSubmitted,
            quizzesAttempted,
            forumPosts,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
