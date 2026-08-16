import { Request, Response } from 'express';
import Badge from '../models/Badge.js';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import GamificationConfig from '../models/GamificationConfig.js';
import { sendNotificationToUser } from "../utils/notificationService.js";

export const seedDefaultBadges = async () => {
  try {
    const defaultBadges = [
      {
        name: "Bronze Medal",
        description: "Awarded automatically when a student accumulates 100+ XP points.",
        icon: "🥉",
        category: "Achievement",
        triggerEvent: "Points Reached",
        thresholdValue: 100,
        pointsBonus: 0,
        isVisible: true,
        active: true,
      },
      {
        name: "Silver Medal",
        description: "Awarded automatically when a student accumulates 500+ XP points.",
        icon: "🥈",
        category: "Achievement",
        triggerEvent: "Points Reached",
        thresholdValue: 500,
        pointsBonus: 0,
        isVisible: true,
        active: true,
      },
      {
        name: "Gold Medal",
        description: "Awarded automatically when a student accumulates 1,000+ XP points.",
        icon: "🥇",
        category: "Achievement",
        triggerEvent: "Points Reached",
        thresholdValue: 1000,
        pointsBonus: 0,
        isVisible: true,
        active: true,
      },
      {
        name: "First Step",
        description: "Awarded automatically when a student completes their first course.",
        icon: "🚀",
        category: "Academic",
        triggerEvent: "Course Completed",
        thresholdValue: 1,
        pointsBonus: 0,
        isVisible: true,
        active: true,
      },
      {
        name: "Course Master",
        description: "Awarded automatically when a student completes 3 or more courses.",
        icon: "🎓",
        category: "Academic",
        triggerEvent: "Courses Completed",
        thresholdValue: 3,
        pointsBonus: 0,
        isVisible: true,
        active: true,
      },
    ];

    for (const b of defaultBadges) {
      const exists = await Badge.findOne({ name: b.name });
      if (!exists) {
        await Badge.create(b);
      }
    }
  } catch (err) {
    console.error("Failed to seed default badges into MongoDB database:", err);
  }
};

export const getBadges = async (req: Request, res: Response): Promise<void> => {
  try {
    await seedDefaultBadges();
    const badges = await Badge.find();
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
    const user = await User.findById(req.body.userId || req.body.studentId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const points = Number(req.body.points) || 0;
    user.points += points;
    await user.save();

    try {
      await sendNotificationToUser(user._id, {
        title: `Points Received! ⭐`,
        message: `You have been awarded ${points} points. Reason: ${req.body.reason || 'Manual award'}`,
        type: "points",
      });
    } catch (e) {
      console.error("Failed to notify user about points manual award:", e);
    }

    res.json({ message: 'Points awarded', totalPoints: user.points });
  } catch (error) {
    res.status(400).json({ message: 'Failed to award points' });
  }
};

export const awardBadge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, studentId, badgeName } = req.body;
    const user = await User.findById(userId || studentId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const currentBadges = Array.isArray(user.badges) ? user.badges : [];
    if (!currentBadges.includes(badgeName)) {
      user.badges.push(badgeName);
      await user.save();

      try {
        await sendNotificationToUser(user._id, {
          title: `Badge Awarded! 🏆`,
          message: `Congratulations! You have been awarded the '${badgeName}' badge!`,
          type: "award",
        });
      } catch (e) {
        console.error("Failed to notify user about badge manual award:", e);
      }
    }

    res.json({ message: 'Badge awarded successfully', badges: user.badges });
  } catch (error) {
    res.status(400).json({ message: 'Failed to award badge' });
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

export const toggleBadgeActive = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      res.status(404).json({ message: 'Badge not found' });
      return;
    }
    badge.active = !badge.active;
    await badge.save();
    res.json(badge);
  } catch (error) {
    res.status(450).json({ message: 'Failed to toggle badge' });
  }
};
