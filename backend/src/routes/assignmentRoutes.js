"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignmentController_1 = require("../controllers/assignmentController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post('/', auth_1.protect, (0, auth_1.authorize)('Lecturer', 'Admin'), assignmentController_1.createAssignment);
router.get('/course/:courseId', auth_1.protect, assignmentController_1.getAssignmentsByCourse);
router.post('/:assignmentId/submit', auth_1.protect, (0, auth_1.authorize)('Student'), upload_1.upload.single('submissionFile'), assignmentController_1.submitAssignment);
router.put('/:submissionId/grade', auth_1.protect, (0, auth_1.authorize)('Lecturer', 'Admin'), assignmentController_1.gradeSubmission);
exports.default = router;
//# sourceMappingURL=assignmentRoutes.js.map