"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forumController_1 = require("../controllers/forumController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/course/:courseId', auth_1.protect, forumController_1.getPostsByCourse);
router.post('/', auth_1.protect, forumController_1.createPost);
router.post('/:postId/reply', auth_1.protect, forumController_1.replyToPost);
exports.default = router;
//# sourceMappingURL=forumRoutes.js.map