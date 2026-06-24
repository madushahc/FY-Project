import { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/User.js";
import { sendNotificationToUser } from "../utils/notificationService.js";
import { checkAndAwardBadges } from "../utils/gamificationService.js";
import { AuthRequest } from "../middleware/auth.js";

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Lecturer, Admin
export const createQuiz = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: "Invalid quiz data", error });
  }
};

// @desc    Get quizzes by course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
export const getCourseQuizzes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const filter: any = { course: req.params.courseId as any };

    // If we want to hide unpublished quizzes for students, we'd check req.user.role
    // but typically `course` access check handles that. For now, return all.
    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Ideally, for students, we should strip out `correctAnswer` to prevent cheating.
    // Assuming the frontend needs to render questions:
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    // For students, we remove correct answers from output
    const isStudent = (req as AuthRequest).user?.role === "Student";

    let quizData = quiz.toObject() as any;
    if (isStudent) {
      quizData.questions = quizData.questions.map((q: any) => {
        const { correctAnswer, ...rest } = q;
        return rest;
      });
    }

    res.json(quizData);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Student
export const submitQuizAttempt = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // Array of { questionId, studentAnswer }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    let earnedPoints = 0;
    let totalPoints = 0;
    const processedAnswers: any[] = [];

    // Calculate score dynamically
    quiz.questions.forEach((q: any) => {
      totalPoints += q.points;

      const submittedAns = answers.find(
        (a: any) => a.questionId.toString() === q._id.toString(),
      );
      let isCorrect = false;

      if (submittedAns) {
        // Simple string comparison for answer (in a real app, might need lowercasing/trimming for short answers)
        if (
          submittedAns.studentAnswer.trim().toLowerCase() ===
          q.correctAnswer.trim().toLowerCase()
        ) {
          isCorrect = true;
          earnedPoints += q.points;
        }

        processedAnswers.push({
          questionId: q._id,
          studentAnswer: submittedAns.studentAnswer,
          isCorrect,
        });
      }
    });

    const scorePercentage =
      totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = scorePercentage >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      quiz: quizId as any,
      student: req.user?._id as any,
      score: scorePercentage,
      earnedPoints,
      answers: processedAnswers,
      passed,
    });

    // Notify instructor about quiz attempt
    try {
      const populatedQuiz: any = await Quiz.findById(quizId).populate("course");
      const instructorId = populatedQuiz.course?.instructor;
      const studentName = req.user?.name || "A student";
      await sendNotificationToUser(instructorId, {
        title: `Quiz attempted: ${populatedQuiz.title}`,
        message: `${studentName} attempted the quiz ${populatedQuiz.title} and scored ${Math.round(scorePercentage)}%`,
        type: "grade",
        linkUrl: `/lecturer/quizzes/${quizId}`,
      });
    } catch (e) {
      console.error("Failed to notify instructor about quiz attempt", e);
    }

    // Award points and badges to the student user
    if (earnedPoints > 0) {
      try {
        const studentUser = await User.findById(req.user?._id);
        if (studentUser) {
          studentUser.points += earnedPoints;
          await studentUser.save();
          
          await sendNotificationToUser(studentUser._id, {
            title: `Points Earned! ⭐`,
            message: `You earned ${earnedPoints} points for attempting the quiz "${quiz.title}".`,
            type: "points",
          });
          
          await checkAndAwardBadges(studentUser);
        }
      } catch (err) {
        console.error("Failed to award points for quiz attempt", err);
      }
    }

    res.status(201).json({ attempt, totalPoints });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
