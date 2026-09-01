import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import { sendNotificationToUser } from "../utils/notificationService.js";
import { checkAndAwardBadges } from "../utils/gamificationService.js";
// @desc    Submit an assignment
// @route   POST /api/submissions
// @access  Student
export const submitAssignment = async (req, res) => {
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
            assignment: assignmentId,
            student: req.user?._id,
        });
        if (submission) {
            // Update existing submission (if allowed)
            submission.fileUrl = fileUrl;
            submission.studentNotes = studentNotes;
            submission.isLate = isLate;
            submission.submittedAt = new Date();
            await submission.save();
        }
        else {
            // Create new submission
            submission = await Submission.create({
                assignment: assignmentId,
                student: req.user?._id,
                fileUrl,
                studentNotes,
                isLate,
            });
        }
        // Notify course instructor about new submission
        try {
            const populatedAssignment = await Assignment.findById(assignmentId).populate("course");
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
        }
        catch (e) {
            console.error("Failed to notify instructor about submission", e);
        }
        res.status(201).json(submission);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Get submissions by assignment ID
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Lecturer, Admin
export const getSubmissionsByAssignment = async (req, res) => {
    try {
        const submissions = await Submission.find({
            assignment: req.params.assignmentId,
        }).populate("student", "name email");
        res.json(submissions);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Lecturer, Admin
export const gradeSubmission = async (req, res) => {
    try {
        const { score, feedback, bonusPoints, badgeName, rubricGrades } = req.body;
        const submission = await Submission.findById(req.params.id).populate("assignment", "title points");
        if (!submission) {
            res.status(404).json({ message: "Submission not found" });
            return;
        }
        if (Array.isArray(rubricGrades) && rubricGrades.length > 0) {
            submission.rubricGrades = rubricGrades;
            submission.score = rubricGrades.reduce((sum, rg) => sum + (Number(rg.score) || 0), 0);
        }
        else {
            submission.score = score;
        }
        submission.feedback = feedback;
        submission.status = "Graded";
        await submission.save();
        const finalScore = submission.score || 0;
        // Create Notification for the student
        const assignmentTitle = submission.assignment.title || "Assignment";
        const maxPoints = submission.assignment.points || 100;
        let gradeMessage = `Your assignment has been graded. Score: ${finalScore}/${maxPoints}.`;
        if (feedback) {
            gradeMessage += ` Feedback: "${feedback}"`;
        }
        if (bonusPoints && bonusPoints > 0) {
            gradeMessage += ` Bonus XP: +${bonusPoints}!`;
        }
        if (badgeName) {
            gradeMessage += ` Badge Awarded: ${badgeName}!`;
        }
        await sendNotificationToUser(submission.student, {
            title: `Assignment Graded: ${assignmentTitle}`,
            message: gradeMessage,
            type: "grade",
            urgency: "normal",
        });
        // Award points and badges to the student user
        if (finalScore > 0 || (bonusPoints && bonusPoints > 0) || badgeName) {
            try {
                const studentUser = await User.findById(submission.student);
                if (studentUser) {
                    let pointsEarned = finalScore > 0 ? Math.round(finalScore) : 0;
                    let addedMsg = "";
                    if (bonusPoints && bonusPoints > 0) {
                        pointsEarned += Math.round(bonusPoints);
                        addedMsg = ` (including ${bonusPoints} bonus points!)`;
                    }
                    if (pointsEarned > 0) {
                        studentUser.points += pointsEarned;
                        await sendNotificationToUser(studentUser._id, {
                            title: `Points Earned! ⭐`,
                            message: `You earned ${pointsEarned} points for assignment "${assignmentTitle}"${addedMsg}.`,
                            type: "points",
                        });
                    }
                    if (badgeName) {
                        const currentBadges = Array.isArray(studentUser.badges) ? studentUser.badges : [];
                        if (!currentBadges.includes(badgeName)) {
                            studentUser.badges.push(badgeName);
                            await sendNotificationToUser(studentUser._id, {
                                title: `Badge Awarded! 🏆`,
                                message: `The lecturer awarded you the '${badgeName}' badge for assignment "${assignmentTitle}".`,
                                type: "award",
                            });
                        }
                    }
                    await studentUser.save();
                    await checkAndAwardBadges(studentUser);
                }
            }
            catch (err) {
                console.error("Failed to award points/badges for submission grading", err);
            }
        }
        res.json(submission);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Get my submissions
// @route   GET /api/submissions/my-submissions
// @access  Student
export const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            student: req.user?._id,
        })
            .populate("assignment")
            .sort({ submittedAt: -1 });
        res.json(submissions);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// @desc    Get aggregate stats for an activity (e.g. total submissions, average score)
// @route   GET /api/submissions/stats/:assignmentId
// @access  Lecturer, Admin
export const getActivityStats = async (req, res) => {
    try {
        const submissions = await Submission.find({
            assignment: req.params.assignmentId,
        });
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
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
