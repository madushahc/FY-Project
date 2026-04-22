import express from 'express';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
router.route('/')
    .get(protect, getCourses)
    .post(protect, authorize('Lecturer', 'Admin'), upload.single('thumbnail'), createCourse);
router.route('/:id')
    .get(protect, getCourseById)
    .put(protect, authorize('Lecturer', 'Admin'), upload.single('thumbnail'), updateCourse)
    .delete(protect, authorize('Lecturer', 'Admin'), deleteCourse);
export default router;
//# sourceMappingURL=courseRoutes.js.map