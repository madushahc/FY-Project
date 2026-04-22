"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, courseController_1.getCourses)
    .post(auth_1.protect, (0, auth_1.authorize)('Lecturer', 'Admin'), upload_1.upload.single('thumbnail'), courseController_1.createCourse);
router.route('/:id')
    .get(auth_1.protect, courseController_1.getCourseById)
    .put(auth_1.protect, (0, auth_1.authorize)('Lecturer', 'Admin'), upload_1.upload.single('thumbnail'), courseController_1.updateCourse)
    .delete(auth_1.protect, (0, auth_1.authorize)('Lecturer', 'Admin'), courseController_1.deleteCourse);
exports.default = router;
//# sourceMappingURL=courseRoutes.js.map