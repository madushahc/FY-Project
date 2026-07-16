import express from 'express';
import { createAssignment, getAssignmentsByCourse, submitAssignment, gradeSubmission, getAssignmentById } from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment creation and submission
 */
/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create an assignment
 *     tags: [Assignments]
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
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               points:
 *                 type: number
 *     responses:
 *       201:
 *         description: Assignment created
 */
router.post('/', protect, authorize('Lecturer', 'Admin'), createAssignment);
/**
 * @swagger
 * /api/assignments/course/{courseId}:
 *   get:
 *     summary: Get assignments by course ID
 *     tags: [Assignments]
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
 *         description: List of assignments
 */
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.get('/:id', protect, getAssignmentById);
/**
 * @swagger
 * /api/assignments/{assignmentId}/submit:
 *   post:
 *     summary: Submit an assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               submissionFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Assignment submitted
 */
router.post('/:assignmentId/submit', protect, authorize('Student'), upload.single('submissionFile'), submitAssignment);
/**
 * @swagger
 * /api/assignments/{submissionId}/grade:
 *   put:
 *     summary: Grade a submission
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
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
router.put('/:submissionId/grade', protect, authorize('Lecturer', 'Admin'), gradeSubmission);
export default router;
//# sourceMappingURL=assignmentRoutes.js.map