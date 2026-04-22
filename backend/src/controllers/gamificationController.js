"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awardPoints = exports.createBadge = exports.getBadges = void 0;
const express_1 = require("express");
const Badge_1 = __importDefault(require("../models/Badge"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const getBadges = async (req, res) => {
    try {
        const badges = await Badge_1.default.find({ active: true });
        res.json(badges);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getBadges = getBadges;
const createBadge = async (req, res) => {
    try {
        const badge = await Badge_1.default.create(req.body);
        res.status(201).json(badge);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid badge data' });
    }
};
exports.createBadge = createBadge;
const awardPoints = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.body.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.points += req.body.points;
        await user.save();
        res.json({ message: 'Points awarded', totalPoints: user.points });
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to award points' });
    }
};
exports.awardPoints = awardPoints;
//# sourceMappingURL=gamificationController.js.map