import express from 'express';
import { getUsers, getProfile, updateProfile, changePassword, createUser, updateUser, deleteUser, getStudentStats } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.get('/', protect, authorize('Admin'), getUsers);
router.post('/', protect, authorize('Admin'), createUser);
router.get('/profile', protect, getProfile);
router.get('/profile/stats', protect, getStudentStats);
router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/:id', protect, authorize('Admin'), updateUser);
router.delete('/:id', protect, authorize('Admin'), deleteUser);
export default router;
//# sourceMappingURL=userRoutes.js.map