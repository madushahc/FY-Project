"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeSubmission = exports.submitAssignment = exports.getAssignmentsByCourse = exports.createAssignment = void 0;
const express_1 = require("express");
const Assignment_1 = __importDefault(require("../models/Assignment"));
const Submission_1 = __importDefault(require("../models/Submission"));
const auth_1 = require("../middleware/auth");
const createAssignment = async (req, res) => {
    try {
        const assignment = await Assignment_1.default.create(req.body);
        res.status(201).json(assignment);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid assignment data' });
    }
};
exports.createAssignment = createAssignment;
const getAssignmentsByCourse = async (req, res) => {
    try {
        const assignments = await Assignment_1.default.find({ course: req.params.courseId });
        res.json(assignments);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getAssignmentsByCourse = getAssignmentsByCourse;
const submitAssignment = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const submission = await Submission_1.default.create({
            assignment: req.params.assignmentId,
            student: req.user?.id,
            fileUrl: `/uploads/${req.file.filename}`,
            studentNotes: req.body.studentNotes || ''
        });
        res.status(201).json(submission);
    }
    catch (error) {
        res.status(400).json({ message: 'Submission failed' });
    }
};
exports.submitAssignment = submitAssignment;
const gradeSubmission = async (req, res) => {
    try {
        const submission = await Submission_1.default.findByIdAndUpdate(req.params.submissionId, {
            score: req.body.score,
            feedback: req.body.feedback,
            status: 'Graded'
        }, { new: true });
        res.json(submission);
    }
    catch (error) {
        res.status(400).json({ message: 'Grading failed' });
    }
};
exports.gradeSubmission = gradeSubmission;
//# sourceMappingURL=assignmentController.js.map