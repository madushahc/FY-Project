import express from "express";
import { enrollInCourse, getMyEnrollments, updateProgress, } from "../controllers/enrollmentController.js";
import { protect, authorize } from "../middleware/auth.js";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollments and progress
 */
/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
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
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully enrolled
 */
router.post("/", protect, authorize("Student"), enrollInCourse);
/**
 * @swagger
 * /api/enrollments/my-enrollments:
 *   get:
 *     summary: Get my enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get("/my-enrollments", protect, authorize("Student"), getMyEnrollments);
/**
 * @swagger
 * /api/enrollments/{id}/progress:
 *   patch:
 *     summary: Update progress
 *     tags: [Enrollments]
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
 *               progress:
 *                 type: number
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.patch("/:id/progress", protect, authorize("Student"), updateProgress);
export default router;
