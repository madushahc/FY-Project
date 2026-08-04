import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAdminReports } from '../controllers/analyticsController.js';
import { getInteractiveAnalytics } from '../controllers/interactiveLessonController.js';
const router = express.Router();
router.get('/admin-reports', protect, authorize('Admin'), getAdminReports);
router.get('/engagement', protect, authorize('Admin', 'Lecturer'), getInteractiveAnalytics);
export default router;
//# sourceMappingURL=analyticsRoutes.js.map