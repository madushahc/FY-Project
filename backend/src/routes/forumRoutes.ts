import express from 'express';
import { getPostsByCourse, createPost, replyToPost } from '../controllers/forumController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/course/:courseId', protect, getPostsByCourse);
router.post('/', protect, createPost);
router.post('/:postId/reply', protect, replyToPost);

export default router;
