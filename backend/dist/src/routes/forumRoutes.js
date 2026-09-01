import express from "express";
import { getPostsByCourse, getAllPosts, createPost, replyToPost, likePost, likeReply, } from "../controllers/forumController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Forum
 *   description: Course discussion forums
 */
/**
 * @swagger
 * /api/forums/course/{courseId}:
 *   get:
 *     summary: Get posts by course ID
 *     tags: [Forum]
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
 *         description: List of forum posts
 */
router.get("/course/:courseId", protect, getPostsByCourse);
router.get("/all", protect, getAllPosts);
/**
 * @swagger
 * /api/forums:
 *   post:
 *     summary: Create a post
 *     tags: [Forum]
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
 *               - content
 *             properties:
 *               courseId:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 */
router.post("/", protect, createPost);
/**
 * @swagger
 * /api/forums/{postId}/reply:
 *   post:
 *     summary: Reply to a post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reply added
 */
router.post("/:postId/reply", protect, replyToPost);
router.post("/:postId/like", protect, likePost);
router.post("/:postId/reply/:replyId/like", protect, likeReply);
export default router;
