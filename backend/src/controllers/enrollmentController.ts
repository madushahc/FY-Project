import { Request, Response } from "express";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { sendNotificationToUser } from "../utils/notificationService.js";
import { checkAndAwardBadges } from "../utils/gamificationService.js";
import { AuthRequest } from "../middleware/auth.js";

// @desc    Enroll student in a course
// @route   POST /api/enrollments
// @access  Student
export const enrollInCourse = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
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
      student: req.user?._id as any,
      course: courseId,
    });

    if (existingEnrollment) {
      res.status(400).json({ message: "Already enrolled in this course" });
      return;
    }

    const enrollment = await Enrollment.create({
      student: req.user?._id as any,
      course: courseId,
      progress: 0,
      completedLessons: [],
    });

    // Notify course instructor that a new student enrolled
    try {
      const instructorId = (course as any).instructor;
      const studentName = req.user?.name || "A student";
      await sendNotificationToUser(instructorId, {
        title: `New enrollment: ${studentName}`,
        message: `${studentName} enrolled in your course ${course.title}`,
        type: "enroll",
        linkUrl: `/lecturer/courses/${course._id}`,
      });
    } catch (e) {
      console.error("Failed to notify instructor about enrollment", e);
    }

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user enrollments
// @route   GET /api/enrollments/my-enrollments
// @access  Student
export const getMyEnrollments = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user?._id as any,
    }).populate("course", "title description thumbnailUrl instructor status");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update progress for an enrollment
// @route   PATCH /api/enrollments/:id/progress
// @access  Student
export const updateProgress = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { completedLessonId } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      res.status(404).json({ message: "Enrollment not found" });
      return;
    }

    const wasCompleted = enrollment.progress === 100;

    // Check authorization
    if (enrollment.student.toString() !== (req.user?._id as any).toString()) {
      res.status(403).json({ message: "Not authorized for this enrollment" });
      return;
    }

    // Add lesson if not already completed
    if (
      completedLessonId &&
      !enrollment.completedLessons.includes(completedLessonId)
    ) {
      enrollment.completedLessons.push(completedLessonId);
    }

    // Automatically calculate and update the progress percentage
    const course = await Course.findById(enrollment.course);
    if (course && course.modules) {
      let totalLessons = 0;
      course.modules.forEach((m: any) => {
        totalLessons += m.lessons?.length || 0;
      });
      if (totalLessons > 0) {
        enrollment.progress = Math.round(
          (enrollment.completedLessons.length / totalLessons) * 100,
        );
      } else {
        enrollment.progress = 100; // If no lessons, it's 100% complete
      }
    }

    // Fallback if manual progress provided
    if (req.body.progress !== undefined) {
      enrollment.progress = req.body.progress;
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
      } catch (err) {
        console.error("Failed to notify course completion", err);
      }
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
