import express from 'express';
import { getBadges, createBadge, awardPoints, getLeaderboard, getPointRules, updatePointRules } from '../controllers/gamificationController.js';
import { protect, authorize } from '../middleware/auth.js';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Gamification
 *   description: Badges, points, and leaderboards
 */
/**
 * @swagger
 * /api/gamification/badges:
 *   get:
 *     summary: Get all badges
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of badges
 *   post:
 *     summary: Create a badge
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - icon
 *               - pointsRequired
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               pointsRequired:
 *                 type: number
 *     responses:
 *       201:
 *         description: Badge created
 */
router.get('/badges', protect, getBadges);
router.post('/badges', protect, authorize('Lecturer', 'Admin'), createBadge);
/**
 * @swagger
 * /api/gamification/award:
 *   post:
 *     summary: Award points to a user
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - points
 *             properties:
 *               userId:
 *                 type: string
 *               points:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Points awarded
 */
router.post('/award', protect, authorize('Lecturer', 'Admin'), awardPoints);
/**
 * @swagger
 * /api/gamification/leaderboard:
 *   get:
 *     summary: Get leaderboard
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard data
 */
router.get('/leaderboard', protect, getLeaderboard);
/**
 * @swagger
 * /api/gamification/rules:
 *   get:
 *     summary: Get gamification rules
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current point rules
 *   post:
 *     summary: Update gamification rules
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignmentSubmission:
 *                 type: number
 *               quizCompletion:
 *                 type: number
 *               forumPost:
 *                 type: number
 *               perfectScoreBonus:
 *                 type: number
 *     responses:
 *       200:
 *         description: Rules updated
 */
router.get('/rules', protect, getPointRules);
router.post('/rules', protect, authorize('Lecturer', 'Admin'), updatePointRules);
export default router;
//# sourceMappingURL=gamificationRoutes.js.map