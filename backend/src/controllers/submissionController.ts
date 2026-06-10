import { Request, Response } from "express";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import Notification from "../models/Notification.js";
import { sendNotificationToUser } from "../utils/notificationService.js";
import { AuthRequest } from "../middleware/auth.js";

// @desc    Submit an assignment
// @route   POST /api/submissions
// @access  Student
export const submitAssignment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { assignmentId, studentNotes } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "File upload is required" });
      return;
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const isLate = new Date() > new Date(assignment.deadline);

    // Check if already submitted
    let submission = await Submission.findOne({
      assignment: assignmentId as any,
      student: req.user?._id as any,
    } as any);

    if (submission) {
      // Update existing submission (if allowed)
      submission.fileUrl = fileUrl;
      submission.studentNotes = studentNotes;
      submission.isLate = isLate;
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      // Create new submission
      submission = await Submission.create({
        assignment: assignmentId,
        student: req.user?._id as any,
        fileUrl,
        studentNotes,
        isLate,
      });
    }

    // Notify course instructor about new submission
    try {
      const populatedAssignment: any =
        await Assignment.findById(assignmentId).populate("course");
      const course = populatedAssignment?.course;
      const instructorId = course?.instructor;
      const studentName = req.user?.name || "A student";
      if (instructorId) {
        await sendNotificationToUser(instructorId, {
          title: `New submission: ${assignment.title}`,
          message: `${studentName} submitted the assignment ${assignment.title}`,
          type: "assignment",
          linkUrl: `/lecturer/assignments/${assignmentId}`,
        });
      }
    } catch (e) {
      console.error("Failed to notify instructor about submission", e);
    }

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get submissions by assignment ID
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Lecturer, Admin
export const getSubmissionsByAssignment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.assignmentId as any,
    } as any).populate("student", "name email");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Lecturer, Admin
export const gradeSubmission = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { score, feedback } = req.body;

    const submission = await Submission.findById(req.params.id).populate(
      "assignment",
      "title",
    );

    if (!submission) {
      res.status(404).json({ message: "Submission not found" });
      return;
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = "Graded";

    await submission.save();

    // Create Notification for the student
    const assignmentTitle =
      (submission as any).assignment.title || "Assignment";
    await Notification.create({
      recipient: submission.student,
      title: `Assignment Graded: ${assignmentTitle}`,
      message: `Your assignment has been graded. You received a score of ${score}.`,
      type: "grade",
      urgency: "normal",
    });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get my submissions
// @route   GET /api/submissions/my-submissions
// @access  Student
export const getMySubmissions = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const submissions = await Submission.find({
      student: req.user?._id as any,
    } as any)
      .populate("assignment")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get aggregate stats for an activity (e.g. total submissions, average score)
// @route   GET /api/submissions/stats/:assignmentId
// @access  Lecturer, Admin
export const getActivityStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.assignmentId as any,
    } as any);
    const total = submissions.length;
    let graded = 0;
    let sum = 0;

    for (const sub of submissions) {
      if (sub.status === "Graded" && sub.score !== undefined) {
        graded++;
        sum += sub.score;
      }
    }

    const avgScore = graded > 0 ? sum / graded : 0;

    res.json({
      totalSubmissions: total,
      averageScore: Math.round(avgScore),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
