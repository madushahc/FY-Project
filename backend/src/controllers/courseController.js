"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getCourses = void 0;
const express_1 = require("express");
const Course_1 = __importDefault(require("../models/Course"));
const auth_1 = require("../middleware/auth");
// @desc    Get all courses (Published for students, All for admin/lecturers)
// @route   GET /api/courses
const getCourses = async (req, res) => {
    try {
        const filter = req.user?.role === 'Student' ? { status: 'Published' } : {};
        const courses = await Course_1.default.find(filter).populate('instructor', 'name email');
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getCourses = getCourses;
// @desc    Get single course
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id)
            .populate('instructor', 'name email')
            .populate('modules.lessons.refId');
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getCourseById = getCourseById;
// @desc    Create new course
// @route   POST /api/courses
// @access  Lecturer, Admin
const createCourse = async (req, res) => {
    try {
        const courseData = { ...req.body, instructor: req.user?.id };
        // Handle thumbnail upload if exists
        if (req.file) {
            courseData.thumbnailUrl = `/uploads/${req.file.filename}`;
        }
        const course = await Course_1.default.create(courseData);
        res.status(201).json(course);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid course data', error });
    }
};
exports.createCourse = createCourse;
// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Lecturer (owner), Admin
const updateCourse = async (req, res) => {
    try {
        let course = await Course_1.default.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        // Check ownership
        if (course.instructor.toString() !== req.user?.id && req.user?.role !== 'Admin') {
            res.status(403).json({ message: 'Not authorized to update this course' });
            return;
        }
        const updateData = { ...req.body };
        if (req.file) {
            updateData.thumbnailUrl = `/uploads/${req.file.filename}`;
        }
        course = await Course_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateCourse = updateCourse;
// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Lecturer (owner), Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (course.instructor.toString() !== req.user?.id && req.user?.role !== 'Admin') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        await course.deleteOne();
        res.json({ message: 'Course removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteCourse = deleteCourse;
//# sourceMappingURL=courseController.js.map