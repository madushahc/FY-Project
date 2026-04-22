import Badge from '../models/Badge.js';
import User from '../models/User.js';
export const getBadges = async (req, res) => {
    try {
        const badges = await Badge.find({ active: true });
        res.json(badges);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
export const createBadge = async (req, res) => {
    try {
        const badge = await Badge.create(req.body);
        res.status(201).json(badge);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid badge data' });
    }
};
export const awardPoints = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.points += req.body.points;
        await user.save();
        res.json({ message: 'Points awarded', totalPoints: user.points });
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to award points' });
    }
};
export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ role: 'Student' })
            .select('name points')
            .sort({ points: -1 })
            .limit(10);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
//# sourceMappingURL=gamificationController.js.map