import express from 'express';
import { createQuiz, getCourseQuizzes, getQuizById, submitQuizAttempt } from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';
const router = express.Router();
router.post('/', protect, authorize('Lecturer', 'Admin'), createQuiz);
router.get('/course/:courseId', protect, getCourseQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/:id/attempt', protect, authorize('Student'), submitQuizAttempt);
export default router;
//# sourceMappingURL=quizRoutes.js.map