import { Request, Response } from 'express';
import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import Notification from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Submit an assignment
// @route   POST /api/submissions
// @access  Student
export const submitAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assignmentId, studentNotes } = req.body;
    
    if (!req.file) {
      res.status(400).json({ message: 'File upload is required' });
      return;
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const isLate = new Date() > new Date(assignment.deadline);

    // Check if already submitted
    let submission = await Submission.findOne({ assignment: assignmentId as any, student: req.user?._id as any } as any);

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
        isLate
      });
    }

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get submissions by assignment ID
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Lecturer, Admin
export const getSubmissionsByAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId as any } as any)
      .populate('student', 'name email');
      
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Lecturer, Admin
export const gradeSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { score, feedback } = req.body;
    
    const submission = await Submission.findById(req.params.id)
      .populate('assignment', 'title');

    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'Graded';
    
    await submission.save();

    // Create Notification for the student
    const assignmentTitle = ((submission as any).assignment).title || 'Assignment';
    await Notification.create({
      recipient: submission.student,
      title: `Assignment Graded: ${assignmentTitle}`,
      message: `Your assignment has been graded. You received a score of ${score}.`,
      type: 'grade',
      urgency: 'normal'
    });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get my submissions
// @route   GET /api/submissions/my-submissions
// @access  Student
export const getMySubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissions = await Submission.find({ student: req.user?._id as any } as any)
      .populate('assignment')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
