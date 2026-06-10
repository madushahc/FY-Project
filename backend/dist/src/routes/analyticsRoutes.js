import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAdminReports } from '../controllers/analyticsController.js';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Platform analytics and reports
 */
/**
 * @swagger
 * /api/analytics/admin-reports:
 *   get:
 *     summary: Get admin analytics reports
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get('/admin-reports', protect, authorize('Admin'), getAdminReports);
export default router;
//# sourceMappingURL=analyticsRoutes.js.map