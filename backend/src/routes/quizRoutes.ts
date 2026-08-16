import express from 'express';
import {
  createQuiz,
  getCourseQuizzes,
  getQuizById,
  startQuizAttempt,
  autoSaveAnswer,
  getMyQuizAttempts,
  submitQuizAttempt,
  getQuizStats,
  getAssignedFinalQuiz
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz creation and attempts
 */

router.get('/course/:courseId/adaptive-final', protect, authorize('Student'), getAssignedFinalQuiz);

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - title
 *             properties:
 *               courseId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               timeLimit:
 *                 type: number
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Quiz created
 */
router.post('/', protect, authorize('Lecturer', 'Admin'), createQuiz);
/**
 * @swagger
 * /api/quizzes/course/{courseId}:
 *   get:
 *     summary: Get quizzes by course ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of quizzes
 */
router.get('/course/:courseId', protect, getCourseQuizzes);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz details
 */
router.get('/:id', protect, getQuizById);
router.get('/:id/stats', protect, getQuizStats);

router.get('/:id/my-attempts', protect, authorize('Student'), getMyQuizAttempts);
router.post('/:id/start', protect, authorize('Student'), startQuizAttempt);
router.post('/:id/auto-save', protect, authorize('Student'), autoSaveAnswer);

/**
 * @swagger
 * /api/quizzes/{id}/attempt:
 *   post:
 *     summary: Submit a quiz attempt
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Quiz attempt submitted
 */
router.post('/:id/attempt', protect, authorize('Student'), submitQuizAttempt);

export default router;
