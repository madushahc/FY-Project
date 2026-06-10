import mongoose from "mongoose";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
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
// @desc    Get single course
// @route   GET /api/courses/:id
export const getCourseById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const course = await Course.findById(req.params.id)
            .populate("instructor", "name email")
            .populate("modules.lessons.refId");
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
        const courseData = { ...req.body, instructor: req.user?._id };
        // Parse JSON strings if data came from FormData
        if (typeof courseData.modules === "string") {
            try {
                courseData.modules = JSON.parse(courseData.modules);
            }
            catch (e) { }
        }
        if (typeof courseData.completionRules === "string") {
            try {
                courseData.completionRules = JSON.parse(courseData.completionRules);
            }
            catch (e) { }
        }
        // Handle thumbnail upload if exists
        if (req.file) {
            courseData.thumbnailUrl = `/uploads/${req.file.filename}`;
        }
        const course = await Course.create(courseData);
        res.status(201).json(course);
    }
    catch (error) {
        console.error("Create course error:", error);
        res.status(400).json({ message: "Invalid course data", error });
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
        // Check ownership
        const instructorIdStr = course.instructor?._id
            ? course.instructor._id.toString()
            : course.instructor?.toString();
        const userIdStr = req.user?.id || req.user?._id?.toString();
        const userRole = String(req.user?.role || "")
            .trim()
            .toLowerCase();
        console.log(`Checking ownership... course.instructor: ${instructorIdStr}, req.user._id: ${userIdStr}`);
        if (instructorIdStr !== userIdStr && userRole !== "admin") {
            console.log(`Ownership check failed. course.instructor: ${instructorIdStr}, user: ${userIdStr}`);
            res.status(403).json({ message: "Not authorized to update this course" });
            return;
        }
        const updateData = { ...req.body };
        // Parse JSON strings if data came from FormData
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
        // Detect module additions/removals if modules provided
        let addedModules = [];
        let removedModules = [];
        if (updateData.modules && Array.isArray(updateData.modules)) {
            const oldTitles = (course.modules || []).map((m) => String(m.title));
            const newTitles = updateData.modules.map((m) => String(m.title));
            addedModules = newTitles.filter((t) => !oldTitles.includes(t));
            removedModules = oldTitles.filter((t) => !newTitles.includes(t));
        }
        course = await Course.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });
        if (!course) {
            res.status(500).json({ message: "Failed to update course" });
            return;
        }
        // If modules changed, notify enrolled students
        try {
            if (addedModules.length > 0 || removedModules.length > 0) {
                const enrollments = await Enrollment.find({ course: course._id });
                const studentIds = enrollments.map((e) => e.student);
                const messages = [];
                if (addedModules.length > 0) {
                    messages.push(sendNotificationsToUsers(studentIds, {
                        title: `New module(s) added to ${course.title}`,
                        message: `New module(s) added: ${addedModules.join(", ")}. Check the course for details.`,
                        type: "system",
                        linkUrl: `/student/courses/${course._id}`,
                    }));
                }
                if (removedModules.length > 0) {
                    messages.push(sendNotificationsToUsers(studentIds, {
                        title: `Module(s) removed from ${course.title}`,
                        message: `The following module(s) were removed: ${removedModules.join(", ")}.`,
                        type: "system",
                        linkUrl: `/student/courses/${course._id}`,
                    }));
                }
                await Promise.all(messages);
            }
        }
        catch (e) {
            console.error("Failed to notify students about module changes", e);
        }
        res.json(course);
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
            res.status(403).json({ message: "Not authorized" });
            return;
        }
        await course.deleteOne();
        res.json({ message: "Course removed" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
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