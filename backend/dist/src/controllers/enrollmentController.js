import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import StudentProgress from "../models/StudentProgress.js";
import { sendNotificationToUser } from "../utils/notificationService.js";
import { checkAndAwardBadges } from "../utils/gamificationService.js";
// @desc    Enroll student in a course
// @route   POST /api/enrollments
// @access  Student
export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: req.user?._id,
            course: courseId,
        });
        if (existingEnrollment) {
            res.status(400).json({ message: "Already enrolled in this course" });
            return;
        }
        const enrollment = await Enrollment.create({
            student: req.user?._id,
            course: courseId,
            progress: 0,
            completedLessons: [],
        });
        // Notify course instructor that a new student enrolled
        try {
            const instructorId = course.instructor;
            const studentName = req.user?.name || "A student";
            await sendNotificationToUser(instructorId, {
                title: `New enrollment: ${studentName}`,
                message: `${studentName} enrolled in your course ${course.title}`,
                type: "enroll",
                linkUrl: `/lecturer/courses/${course._id}`,
            });
        }
        catch (e) {
            console.error("Failed to notify instructor about enrollment", e);
        }
        res.status(201).json(enrollment);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Get user enrollments
// @route   GET /api/enrollments/my-enrollments
// @access  Student
export const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.user?._id,
        }).populate("course", "title description thumbnailUrl instructor status modules");
        const validEnrollments = enrollments.filter((e) => e.course != null);
        const orphanEnrollmentIds = enrollments
            .filter((e) => !e.course)
            .map((e) => e._id);
        if (orphanEnrollmentIds.length > 0) {
            await Enrollment.deleteMany({ _id: { $in: orphanEnrollmentIds } });
        }
        // Ensure progress is always safely capped at 100% and recalculated accurately
        const sanitizedEnrollments = validEnrollments.map((e) => {
            const eObj = e.toObject();
            const courseModules = eObj.course?.modules || [];
            let totalLessons = 0;
            const validLessonIds = new Set();
            courseModules.forEach((m) => {
                m.lessons?.forEach((l) => {
                    totalLessons++;
                    if (l._id)
                        validLessonIds.add(String(l._id));
                    if (l.title)
                        validLessonIds.add(String(l.title));
                });
            });
            if (totalLessons > 0) {
                const completedCount = (eObj.completedLessons || []).filter((id) => validLessonIds.has(String(id))).length;
                eObj.progress = Math.min(100, Math.round((completedCount / totalLessons) * 100));
            }
            else {
                eObj.progress = Math.min(100, Math.max(0, eObj.progress || 0));
            }
            return eObj;
        });
        res.json(sanitizedEnrollments);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Update progress for an enrollment
// @route   PATCH /api/enrollments/:id/progress
// @access  Student
export const updateProgress = async (req, res) => {
    try {
        const { completedLessonId } = req.body;
        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) {
            res.status(404).json({ message: "Enrollment not found" });
            return;
        }
        const wasCompleted = enrollment.progress === 100;
        // Check authorization
        if (enrollment.student.toString() !== (req.user?._id).toString()) {
            res.status(403).json({ message: "Not authorized for this enrollment" });
            return;
        }
        const alreadyCompleted = enrollment.completedLessons.some((id) => String(id) === String(completedLessonId));
        if (completedLessonId && !alreadyCompleted) {
            let lessonProgress = await StudentProgress.findOne({
                student: enrollment.student,
                course: enrollment.course,
                lessonId: completedLessonId
            });
            if (!lessonProgress) {
                lessonProgress = new StudentProgress({
                    student: enrollment.student,
                    course: enrollment.course,
                    lessonId: completedLessonId,
                    completed: true,
                    completedAt: new Date()
                });
            }
            else {
                lessonProgress.completed = true;
                lessonProgress.completedAt = new Date();
            }
            await lessonProgress.save();
            const lessonObjId = mongoose.Types.ObjectId.isValid(completedLessonId)
                ? new mongoose.Types.ObjectId(completedLessonId)
                : completedLessonId;
            enrollment.completedLessons.push(lessonObjId);
        }
        // Automatically calculate and update the progress percentage safely capped at 100%
        const course = await Course.findById(enrollment.course);
        if (course && course.modules) {
            let totalLessons = 0;
            const validLessonIds = new Set();
            course.modules.forEach((m) => {
                m.lessons?.forEach((l) => {
                    totalLessons++;
                    if (l._id)
                        validLessonIds.add(String(l._id));
                    if (l.title)
                        validLessonIds.add(String(l.title));
                });
            });
            const completedCount = enrollment.completedLessons.filter((id) => validLessonIds.has(String(id))).length;
            if (totalLessons > 0) {
                enrollment.progress = Math.min(100, Math.round((completedCount / totalLessons) * 100));
            }
            else {
                enrollment.progress = 100; // If no lessons, it's 100% complete
            }
        }
        // Fallback if manual progress provided
        if (req.body.progress !== undefined) {
            enrollment.progress = Math.min(100, Math.max(0, req.body.progress));
        }
        const isCompletedNow = enrollment.progress === 100;
        await enrollment.save();
        if (isCompletedNow && !wasCompleted) {
            try {
                const studentUser = await User.findById(enrollment.student);
                if (studentUser) {
                    studentUser.points += 200;
                    await studentUser.save();
                    await sendNotificationToUser(studentUser._id, {
                        title: `Course Completed! 🎉`,
                        message: `Congratulations! You have completed the course "${course?.title || 'Course'}" and earned 200 XP!`,
                        type: "award",
                        linkUrl: `/student/courses/${enrollment.course}`
                    });
                    await checkAndAwardBadges(studentUser);
                }
            }
            catch (err) {
                console.error("Failed to notify course completion", err);
            }
        }
        res.json(enrollment);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
//# sourceMappingURL=enrollmentController.js.map