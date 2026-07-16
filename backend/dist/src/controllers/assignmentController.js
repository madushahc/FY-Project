import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
export const createAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.create(req.body);
        res.status(201).json(assignment);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid assignment data' });
    }
};
export const getAssignmentsByCourse = async (req, res) => {
    try {
        const filter = { course: req.params.courseId };
        const assignments = await Assignment.find(filter);
        res.json(assignments);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
export const submitAssignment = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const submission = await Submission.create({
            assignment: req.params.assignmentId,
            student: req.user?._id,
            fileUrl: `/uploads/${req.file.filename}`,
            studentNotes: req.body.studentNotes || ''
        });
        res.status(201).json(submission);
    }
    catch (error) {
        res.status(400).json({ message: 'Submission failed' });
    }
};
export const gradeSubmission = async (req, res) => {
    try {
        const submission = await Submission.findByIdAndUpdate(req.params.submissionId, {
            score: req.body.score,
            feedback: req.body.feedback,
            status: 'Graded'
        }, { new: true });
        res.json(submission);
    }
    catch (error) {
        res.status(400).json({ message: 'Grading failed' });
    }
};
export const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            res.status(404).json({ message: 'Assignment not found' });
            return;
        }
        res.json(assignment);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
//# sourceMappingURL=assignmentController.js.map