import express from 'express';
import { createAssignment, getAssignmentsByCourse, submitAssignment, gradeSubmission } from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
router.post('/', protect, authorize('Lecturer', 'Admin'), createAssignment);
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.post('/:assignmentId/submit', protect, authorize('Student'), upload.single('submissionFile'), submitAssignment);
router.put('/:submissionId/grade', protect, authorize('Lecturer', 'Admin'), gradeSubmission);
export default router;
//# sourceMappingURL=assignmentRoutes.js.map