import { Request, Response } from 'express';
import Badge from '../models/Badge.js';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import GamificationConfig from '../models/GamificationConfig.js';

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

export const getPointRules = async (req: Request, res: Response): Promise<void> => {
    try {
        let config = await GamificationConfig.findOne();
        if (!config) {
            config = await GamificationConfig.create({});
        }
        res.json(config);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error fetching point rules' });
    }
};

export const updatePointRules = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let config = await GamificationConfig.findOne();
        if (!config) {
            config = new GamificationConfig(req.body);
        } else {
            config.lesson = req.body.lesson ?? config.lesson;
            config.quiz = req.body.quiz ?? config.quiz;
            config.assignment = req.body.assignment ?? config.assignment;
            config.forum = req.body.forum ?? config.forum;
        }
        await config.save();
        res.json(config);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error updating point rules' });
    }
};
