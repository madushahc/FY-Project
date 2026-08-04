import express from 'express';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, getLecturerStudents } from '../controllers/courseController.js';
import { recordQuestionAnswer, getLessonProgress, getInteractiveAnalytics, recordWatchProgress } from '../controllers/interactiveLessonController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */
// Interactive video analytics
router.get('/analytics/interactive', protect, authorize('Lecturer', 'Admin'), getInteractiveAnalytics);
// Interactive video lesson endpoints
router.post('/:courseId/lessons/:lessonId/answer', protect, recordQuestionAnswer);
router.post('/:courseId/lessons/:lessonId/watch-progress', protect, recordWatchProgress);
router.get('/:courseId/lessons/:lessonId/progress', protect, getLessonProgress);
/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created
 */
router.route('/')
    .get(protect, getCourses)
    .post(protect, authorize('Lecturer', 'Admin'), upload.single('thumbnail'), createCourse);
/**
 * @swagger
 * /api/courses/lecturer/students:
 *   get:
 *     summary: Get all enrolled students for a lecturer's courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 */
router.get('/lecturer/students', protect, authorize('Lecturer'), getLecturerStudents);
/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
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
 *         description: Course details
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
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
 *         description: Course removed
 */
router.route('/:id')
    .get(protect, getCourseById)
    .put(protect, authorize('Lecturer', 'Admin'), upload.single('thumbnail'), updateCourse)
    .delete(protect, authorize('Lecturer', 'Admin'), deleteCourse);
export default router;
//# sourceMappingURL=courseRoutes.js.map