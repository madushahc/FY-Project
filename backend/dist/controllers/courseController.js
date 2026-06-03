import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
// @desc    Get all courses (Published for students, All for admin/lecturers)
// @route   GET /api/courses
export const getCourses = async (req, res) => {
    try {
        const filter = req.user?.role === 'Student' ? { status: 'Published' } : {};
        const courses = await Course.find(filter).populate('instructor', 'name email').lean();
        // Attach enrollment counts
        const coursesWithCounts = await Promise.all(courses.map(async (c) => {
            const count = await Enrollment.countDocuments({ course: c._id });
            return { ...c, enrollmentCount: count };
        }));
        res.json(coursesWithCounts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get single course
// @route   GET /api/courses/:id
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
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
// @desc    Create new course
// @route   POST /api/courses
// @access  Lecturer, Admin
export const createCourse = async (req, res) => {
    try {
        const courseData = { ...req.body, instructor: req.user?._id };
        // Parse JSON strings if data came from FormData
        if (typeof courseData.modules === 'string') {
            try {
                courseData.modules = JSON.parse(courseData.modules);
            }
            catch (e) { }
        }
        if (typeof courseData.completionRules === 'string') {
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
        console.error('Create course error:', error);
        res.status(400).json({ message: 'Invalid course data', error });
    }
};
// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Lecturer (owner), Admin
export const updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        // Check ownership
        if (course.instructor.toString() !== req.user?._id && req.user?.role !== 'Admin') {
            res.status(403).json({ message: 'Not authorized to update this course' });
            return;
        }
        const updateData = { ...req.body };
        // Parse JSON strings if data came from FormData
        if (typeof updateData.modules === 'string') {
            try {
                updateData.modules = JSON.parse(updateData.modules);
            }
            catch (e) { }
        }
        if (typeof updateData.completionRules === 'string') {
            try {
                updateData.completionRules = JSON.parse(updateData.completionRules);
            }
            catch (e) { }
        }
        if (req.file) {
            updateData.thumbnailUrl = `/uploads/${req.file.filename}`;
        }
        course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Lecturer (owner), Admin
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (course.instructor.toString() !== req.user?._id && req.user?.role !== 'Admin') {
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
// @desc    Get all students enrolled in lecturer's courses
// @route   GET /api/courses/lecturer/students
// @access  Lecturer
export const getLecturerStudents = async (req, res) => {
    try {
        if (!req.user?._id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const myCourses = await Course.find({ instructor: req.user._id });
        const courseIds = myCourses.map(c => c._id);
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('user', 'name email profilePic')
            .populate('course', 'title');
        res.json(enrollments);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
//# sourceMappingURL=courseController.js.map