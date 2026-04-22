import { Request, Response } from 'express';
import Course from '../models/Course.js';
import { AuthRequest } from '../middleware/auth.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all courses (Published for students, All for admin/lecturers)
// @route   GET /api/courses
export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = req.user?.role === 'Student' ? { status: 'Published' } : {};
    const courses = await Course.find(filter).populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('modules.lessons.refId');
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Lecturer, Admin
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseData = { ...req.body, instructor: req.user?._id as any };
    
    // Handle thumbnail upload if exists
    if (req.file) {
      courseData.thumbnailUrl = `/uploads/${req.file.filename}`;
    }

    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Invalid course data', error });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Lecturer (owner), Admin
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check ownership
    if (course.instructor.toString() !== req.user?._id as any && req.user?.role !== 'Admin') {
      res.status(403).json({ message: 'Not authorized to update this course' });
      return;
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.thumbnailUrl = `/uploads/${req.file.filename}`;
    }

    course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Lecturer (owner), Admin
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.instructor.toString() !== req.user?._id as any && req.user?.role !== 'Admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
