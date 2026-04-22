import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
// @desc    Enroll student in a course
// @route   POST /api/enrollments
// @access  Student
export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: req.user?._id,
            course: courseId
        });
        if (existingEnrollment) {
            res.status(400).json({ message: 'Already enrolled in this course' });
            return;
        }
        const enrollment = await Enrollment.create({
            student: req.user?._id,
            course: courseId,
            progress: 0,
            completedLessons: []
        });
        res.status(201).json(enrollment);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get user enrollments
// @route   GET /api/enrollments/my-enrollments
// @access  Student
export const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user?._id })
            .populate('course', 'title description thumbnailUrl instructor status');
        res.json(enrollments);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
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
            res.status(404).json({ message: 'Enrollment not found' });
            return;
        }
        // Check authorization
        if (enrollment.student.toString() !== req.user?._id) {
            res.status(403).json({ message: 'Not authorized for this enrollment' });
            return;
        }
        // Add lesson if not already completed
        if (completedLessonId && !enrollment.completedLessons.includes(completedLessonId)) {
            enrollment.completedLessons.push(completedLessonId);
        }
        // Calculate progress (Ideally, fetch total course lessons here to calculate accurate %, but for now, we just accept a custom input or do an increment based on a simple formula. Let's just update the provided `progress` value to keep it simple, or calculate it based on a request param.)
        if (req.body.progress !== undefined) {
            enrollment.progress = req.body.progress;
        }
        await enrollment.save();
        res.json(enrollment);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
//# sourceMappingURL=enrollmentController.js.map