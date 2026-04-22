import express from 'express';
import { submitAssignment, getSubmissionsByAssignment, gradeSubmission, getMySubmissions } from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
router.get('/my-submissions', protect, authorize('Student'), getMySubmissions);
router.post('/', protect, authorize('Student'), upload.single('file'), submitAssignment);
router.get('/assignment/:assignmentId', protect, authorize('Lecturer', 'Admin'), getSubmissionsByAssignment);
router.put('/:id/grade', protect, authorize('Lecturer', 'Admin'), gradeSubmission);
export default router;
//# sourceMappingURL=submissionRoutes.js.map