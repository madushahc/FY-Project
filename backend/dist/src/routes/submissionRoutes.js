import express from 'express';
import { submitAssignment, getSubmissionsByAssignment, gradeSubmission, getMySubmissions, getActivityStats } from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: Assignment and activity submissions
 */
/**
 * @swagger
 * /api/submissions/my-submissions:
 *   get:
 *     summary: Get my submissions
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my submissions
 */
router.get('/my-submissions', protect, authorize('Student'), getMySubmissions);
/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Submit an assignment
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentId
 *             properties:
 *               assignmentId:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Submission successful
 */
router.post('/', protect, authorize('Student'), upload.single('file'), submitAssignment);
/**
 * @swagger
 * /api/submissions/assignment/{assignmentId}:
 *   get:
 *     summary: Get submissions by assignment ID
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of submissions
 */
router.get('/assignment/:assignmentId', protect, authorize('Lecturer', 'Admin'), getSubmissionsByAssignment);
/**
 * @swagger
 * /api/submissions/stats/{assignmentId}:
 *   get:
 *     summary: Get activity stats for an assignment
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity stats
 */
router.get('/stats/:assignmentId', protect, authorize('Lecturer', 'Admin'), getActivityStats);
/**
 * @swagger
 * /api/submissions/{id}/grade:
 *   put:
 *     summary: Grade a submission
 *     tags: [Submissions]
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
 *             required:
 *               - grade
 *             properties:
 *               grade:
 *                 type: number
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission graded
 */
router.put('/:id/grade', protect, authorize('Lecturer', 'Admin'), gradeSubmission);
export default router;
//# sourceMappingURL=submissionRoutes.js.map