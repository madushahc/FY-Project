import User from "../models/User.js";
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
//# sourceMappingURL=userController.js.map