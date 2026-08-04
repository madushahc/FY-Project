import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import StudentProgress from "../models/StudentProgress.js";
import ForumPost from "../models/ForumPost.js";
import Notification from "../models/Notification.js";
import { sendNotificationsToUsers } from "../utils/notificationService.js";
// @desc    Get all courses (Published for students, All for admin/lecturers)
// @route   GET /api/courses
export const getCourses = async (req, res) => {
    try {
        const filter = req.user?.role === "Student" ? { status: "Published" } : {};
        const courses = await Course.find(filter)
            .populate("instructor", "name email")
            .lean();
        // Attach enrollment counts
        const coursesWithCounts = await Promise.all(courses.map(async (c) => {
            const count = await Enrollment.countDocuments({ course: c._id });
            return { ...c, enrollmentCount: count };
        }));
        res.json(coursesWithCounts);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Get single course by ID
// @route   GET /api/courses/:id
export const getCourseById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const course = await Course.findById(req.params.id).populate("instructor", "name email");
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Create new course
// @route   POST /api/courses
// @access  Lecturer, Admin
export const createCourse = async (req, res) => {
    try {
        const { title, description, code, department, category, status, enrollmentType, completionRules, modules, instructor } = req.body;
        let thumbnailUrl = "";
        if (req.file) {
            thumbnailUrl = `/uploads/${req.file.filename}`;
        }
        else if (req.body.thumbnailUrl) {
            thumbnailUrl = req.body.thumbnailUrl;
        }
        let parsedRules = completionRules;
        if (typeof completionRules === "string") {
            try {
                parsedRules = JSON.parse(completionRules);
            }
            catch {
                parsedRules = {};
            }
        }
        let parsedModules = modules;
        if (typeof modules === "string") {
            try {
                parsedModules = JSON.parse(modules);
            }
            catch {
                parsedModules = [];
            }
        }
        const assignedInstructor = (req.user?.role === "Admin" && instructor)
            ? instructor
            : req.user?._id;
        const course = await Course.create({
            title,
            code,
            description,
            department,
            category,
            instructor: assignedInstructor,
            status: status || "Draft",
            enrollmentType: enrollmentType || "Open",
            completionRules: parsedRules,
            modules: parsedModules || [],
            thumbnailUrl,
        });
        res.status(201).json(course);
    }
    catch (error) {
        res.status(400).json({ message: error.message || "Failed to create course" });
    }
};
// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Lecturer (owner), Admin
export const updateCourse = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        let course = await Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const instructorIdStr = course.instructor?._id
            ? course.instructor._id.toString()
            : course.instructor?.toString();
        const userIdStr = req.user?.id || req.user?._id?.toString();
        const userRole = String(req.user?.role || "")
            .trim()
            .toLowerCase();
        if (instructorIdStr !== userIdStr && userRole !== "admin") {
            res.status(403).json({ message: "Not authorized to update this course" });
            return;
        }
        const updateData = { ...req.body };
        if (typeof updateData.modules === "string") {
            try {
                updateData.modules = JSON.parse(updateData.modules);
            }
            catch (e) { }
        }
        if (typeof updateData.completionRules === "string") {
            try {
                updateData.completionRules = JSON.parse(updateData.completionRules);
            }
            catch (e) { }
        }
        if (req.file) {
            updateData.thumbnailUrl = `/uploads/${req.file.filename}`;
        }
        let addedModules = [];
        let removedModules = [];
        if (updateData.modules && Array.isArray(updateData.modules)) {
            const oldTitles = (course.modules || []).map((m) => String(m.title));
            const newTitles = updateData.modules.map((m) => String(m.title));
            addedModules = newTitles.filter((t) => !oldTitles.includes(t));
            removedModules = oldTitles.filter((t) => !newTitles.includes(t));
        }
        const wasPublished = course?.status === "Published";
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });
        if (!updatedCourse) {
            res.status(500).json({ message: "Failed to update course" });
            return;
        }
        if (updatedCourse.status === "Published" && !wasPublished) {
            try {
                const students = await User.find({ role: "Student" });
                const studentIds = students.map((s) => s._id);
                await sendNotificationsToUsers(studentIds, {
                    title: `New Course Available`,
                    message: `The course "${updatedCourse.title}" has been published. Enroll now to start learning!`,
                    type: "enroll",
                    linkUrl: `/student/browse-courses`
                });
            }
            catch (err) {
                console.error("Failed to notify course publication", err);
            }
        }
        try {
            if (addedModules.length > 0 || removedModules.length > 0) {
                const enrollments = await Enrollment.find({ course: updatedCourse._id });
                const studentIds = enrollments.map((e) => e.student);
                const messages = [];
                if (addedModules.length > 0) {
                    messages.push(sendNotificationsToUsers(studentIds, {
                        title: `New module(s) added to ${updatedCourse.title}`,
                        message: `New module(s) added: ${addedModules.join(", ")}. Check the course for details.`,
                        type: "system",
                        linkUrl: `/student/courses/${updatedCourse._id}`,
                    }));
                }
                if (removedModules.length > 0) {
                    messages.push(sendNotificationsToUsers(studentIds, {
                        title: `Module(s) removed from ${updatedCourse.title}`,
                        message: `The following module(s) were removed: ${removedModules.join(", ")}.`,
                        type: "system",
                        linkUrl: `/student/courses/${updatedCourse._id}`,
                    }));
                }
                await Promise.all(messages);
            }
        }
        catch (e) {
            console.error("Failed to notify students about module changes", e);
        }
        res.json(updatedCourse);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Lecturer (owner), Admin
export const deleteCourse = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const course = await Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const instructorIdStr = course.instructor?._id
            ? course.instructor._id.toString()
            : course.instructor?.toString();
        const userIdStr = req.user?.id || req.user?._id?.toString();
        const userRole = String(req.user?.role || "")
            .trim()
            .toLowerCase();
        if (instructorIdStr !== userIdStr && userRole !== "admin") {
            res.status(403).json({ message: "Not authorized to delete this course" });
            return;
        }
        const courseId = course._id;
        // 1. Delete all Enrollments for this course
        await Enrollment.deleteMany({ course: courseId });
        // 2. Find and delete all Quizzes and QuizAttempts for this course
        const quizzes = await Quiz.find({ course: courseId });
        const quizIds = quizzes.map((q) => q._id);
        if (quizIds.length > 0) {
            await QuizAttempt.deleteMany({ quiz: { $in: quizIds } });
            await Quiz.deleteMany({ course: courseId });
        }
        // 3. Find and delete all Assignments and Submissions for this course
        const assignments = await Assignment.find({ course: courseId });
        const assignmentIds = assignments.map((a) => a._id);
        if (assignmentIds.length > 0) {
            await Submission.deleteMany({ assignment: { $in: assignmentIds } });
            await Assignment.deleteMany({ course: courseId });
        }
        // 4. Delete all StudentProgress records for this course
        await StudentProgress.deleteMany({ course: courseId });
        // 5. Delete all ForumPosts for this course
        await ForumPost.deleteMany({ course: courseId });
        // 6. Delete all Notifications related to this course
        await Notification.deleteMany({ course: courseId });
        // 7. Delete the course document
        await course.deleteOne();
        res.json({ message: "Course and all related data removed successfully" });
    }
    catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Server Error deleting course" });
    }
};
// @desc    Get all students enrolled in lecturer's courses
// @route   GET /api/courses/lecturer/students
// @access  Lecturer
export const getLecturerStudents = async (req, res) => {
    try {
        if (!req.user?._id) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const myCourses = await Course.find({ instructor: req.user._id });
        const courseIds = myCourses.map((c) => c._id);
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate("student", "name email profilePhoto points")
            .populate("course", "title");
        res.json(enrollments);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
//# sourceMappingURL=courseController.js.map