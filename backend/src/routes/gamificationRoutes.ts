import express from 'express';
import { getBadges, createBadge, awardPoints, getLeaderboard } from '../controllers/gamificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/badges', protect, getBadges);
router.post('/badges', protect, authorize('Lecturer', 'Admin'), createBadge);
router.post('/award', protect, authorize('Lecturer', 'Admin'), awardPoints);
router.get('/leaderboard', protect, getLeaderboard);

export default router;
