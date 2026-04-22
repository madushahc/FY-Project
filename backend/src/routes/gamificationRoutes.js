"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gamificationController_1 = require("../controllers/gamificationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/badges', auth_1.protect, gamificationController_1.getBadges);
router.post('/badges', auth_1.protect, (0, auth_1.authorize)('Lecturer', 'Admin'), gamificationController_1.createBadge);
router.post('/award', auth_1.protect, (0, auth_1.authorize)('Lecturer', 'Admin'), gamificationController_1.awardPoints);
exports.default = router;
//# sourceMappingURL=gamificationRoutes.js.map