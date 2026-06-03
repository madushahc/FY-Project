import { Request, Response } from "express";
import Course from "../models/Course.js";
import { AuthRequest } from "../middleware/auth.js";
import Enrollment from "../models/Enrollment.js";

// @desc    Get all courses (Published for students, All for admin/lecturers)
// @route   GET /api/courses
export const getCourses = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const filter = req.user?.role === "Student" ? { status: "Published" } : {};
    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .lean();

    // Attach enrollment counts
    const coursesWithCounts = await Promise.all(
      courses.map(async (c: any) => {
        const count = await Enrollment.countDocuments({ course: c._id });
        return { ...c, enrollmentCount: count };
      }),
    );

    res.json(coursesWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get courses created by the logged-in lecturer/admin
// @route   GET /api/courses/my-courses
export const getMyCourses = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const courses = await Course.find({ instructor: req.user._id as any })
      .populate("instructor", "name email")
      .lean();

    const coursesWithCounts = await Promise.all(
      courses.map(async (c: any) => {
        const count = await Enrollment.countDocuments({ course: c._id });
        return { ...c, enrollmentCount: count };
      }),
    );

    res.json(coursesWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
export const getCourseById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("modules.lessons.refId");
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Lecturer, Admin
export const createCourse = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const courseData = { ...req.body, instructor: req.user?._id as any };

    // Parse JSON strings if data came from FormData
    if (typeof courseData.modules === "string") {
      try {
        courseData.modules = JSON.parse(courseData.modules);
      } catch (e) {}
    }
    if (typeof courseData.completionRules === "string") {
      try {
        courseData.completionRules = JSON.parse(courseData.completionRules);
      } catch (e) {}
    }

    // Handle thumbnail upload if exists
    if (req.file) {
      courseData.thumbnailUrl = `/uploads/${req.file.filename}`;
    }

    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    res.status(400).json({ message: "Invalid course data", error });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Lecturer (owner), Admin
export const updateCourse = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Check ownership
    const instructorIdStr = (course.instructor as any)?._id
      ? (course.instructor as any)._id.toString()
      : course.instructor?.toString();
    const userIdStr = (req.user as any)?.id || req.user?._id?.toString();
    const userRole = String(req.user?.role || "")
      .trim()
      .toLowerCase();
    console.log(
      `Checking ownership... course.instructor: ${instructorIdStr}, req.user._id: ${userIdStr}`,
    );
    if (instructorIdStr !== userIdStr && userRole !== "admin") {
      console.log(
        `Ownership check failed. course.instructor: ${instructorIdStr}, user: ${userIdStr}`,
      );
      res.status(403).json({ message: "Not authorized to update this course" });
      return;
    }

    const updateData = { ...req.body };

    // Parse JSON strings if data came from FormData
    if (typeof updateData.modules === "string") {
      try {
        updateData.modules = JSON.parse(updateData.modules);
      } catch (e) {}
    }
    if (typeof updateData.completionRules === "string") {
      try {
        updateData.completionRules = JSON.parse(updateData.completionRules);
      } catch (e) {}
    }
    if (req.file) {
      updateData.thumbnailUrl = `/uploads/${req.file.filename}`;
    }

    course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Lecturer (owner), Admin
export const deleteCourse = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const instructorIdStr = (course.instructor as any)?._id
      ? (course.instructor as any)._id.toString()
      : course.instructor?.toString();
    const userIdStr = (req.user as any)?.id || req.user?._id?.toString();
    const userRole = String(req.user?.role || "")
      .trim()
      .toLowerCase();
    if (instructorIdStr !== userIdStr && userRole !== "admin") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await course.deleteOne();
    res.json({ message: "Course removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all students enrolled in lecturer's courses
// @route   GET /api/courses/lecturer/students
// @access  Lecturer
export const getLecturerStudents = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const myCourses = await Course.find({ instructor: req.user._id as any });
    const courseIds = myCourses.map((c) => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("user", "name email profilePic")
      .populate("course", "title");

    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
