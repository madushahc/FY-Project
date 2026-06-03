import User from '../models/User.js';
// @desc    Get all users
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
//# sourceMappingURL=userController.js.map