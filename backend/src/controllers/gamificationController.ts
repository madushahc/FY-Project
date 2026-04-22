import { Request, Response } from 'express';
import Badge from '../models/Badge.js';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

export const getBadges = async (req: Request, res: Response): Promise<void> => {
  try {
    const badges = await Badge.find({ active: true });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createBadge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json(badge);
  } catch (error) {
    res.status(400).json({ message: 'Invalid badge data' });
  }
};

export const awardPoints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.points += req.body.points;
    await user.save();
    
    res.json({ message: 'Points awarded', totalPoints: user.points });
  } catch (error) {
    res.status(400).json({ message: 'Failed to award points' });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: 'Student' })
      .select('name points')
      .sort({ points: -1 })
      .limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
