import express from 'express';
import { enrollInCourse, getMyEnrollments, updateProgress } from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('Student'), enrollInCourse);
router.get('/my-enrollments', protect, authorize('Student'), getMyEnrollments);
router.patch('/:id/progress', protect, authorize('Student'), updateProgress);

export default router;
