import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAdminReports } from '../controllers/analyticsController.js';
import { getInteractiveAnalytics, exportResearchData, exportRawEventsData } from '../controllers/interactiveLessonController.js';
const router = express.Router();
router.get('/admin-reports', protect, authorize('Admin'), getAdminReports);
router.get('/engagement', protect, authorize('Admin', 'Lecturer'), getInteractiveAnalytics);
router.get('/research-export', protect, authorize('Admin', 'Lecturer'), exportResearchData);
router.get('/raw-events-export', protect, authorize('Admin', 'Lecturer'), exportRawEventsData);
export default router;
//# sourceMappingURL=analyticsRoutes.js.map