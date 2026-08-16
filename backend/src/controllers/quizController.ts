import { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import StudentProgress from "../models/StudentProgress.js";
import Enrollment from "../models/Enrollment.js";
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
    const data = { ...req.body };

    // Process attempts allowed
    if (data.attemptsAllowed !== undefined) {
      const attVal = String(data.attemptsAllowed);
      if (attVal === '1' || attVal === '1 attempt only') {
        data.oneAttemptOnly = true;
        data.maxAttempts = 1;
      } else if (attVal === 'unlimited' || Number(attVal) >= 999) {
        data.oneAttemptOnly = false;
        data.maxAttempts = null;
      } else {
        const parsed = Number(attVal);
        if (!isNaN(parsed) && parsed > 0) {
          data.oneAttemptOnly = parsed === 1;
          data.maxAttempts = parsed;
        }
      }
    } else if (data.oneAttemptOnly) {
      data.maxAttempts = 1;
    }

    // Assign question points based on totalPoints if provided
    if (data.totalPoints && Array.isArray(data.questions) && data.questions.length > 0) {
      const perQuestionPoints = Math.max(1, Math.round(Number(data.totalPoints) / data.questions.length));
      data.questions = data.questions.map((q: any) => ({
        ...q,
        points: q.points || perQuestionPoints
      }));
    }

    const quiz = await Quiz.create(data);
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

// @desc    Start a quiz attempt
// @route   POST /api/quizzes/:id/start
// @access  Student
export const startQuizAttempt = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const quizId = req.params.id;
    const studentId = req.user?._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    // Check attempt restrictions
    const previousAttempts = await QuizAttempt.find({ quiz: quizId as any, student: studentId as any }).sort({ createdAt: -1 });
    const attemptCount = previousAttempts.length;

    if (quiz.oneAttemptOnly && attemptCount >= 1) {
      res.status(403).json({
        message: "This quiz allows only one attempt.",
        previousAttempts,
        isRestricted: true
      });
      return;
    }

    if (quiz.maxAttempts && attemptCount >= quiz.maxAttempts) {
      res.status(403).json({
        message: `Maximum attempt limit (${quiz.maxAttempts}) reached for this quiz.`,
        previousAttempts,
        isRestricted: true
      });
      return;
    }

    const timeLimitMinutes = quiz.timeLimit || 0;
    const durationSeconds = timeLimitMinutes * 60;
    const startedAt = new Date();

    const attempt = await QuizAttempt.create({
      quiz: quizId as any,
      student: studentId as any,
      score: 0,
      earnedPoints: 0,
      answers: [],
      startedAt,
      durationSeconds,
      answersSaved: [],
      passed: false
    });

    res.status(201).json({
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      durationSeconds: attempt.durationSeconds,
      attemptNumber: attemptCount + 1
    });
  } catch (error: any) {
    console.error("Error starting quiz attempt:", error);
    res.status(500).json({ message: "Server Error", error: error?.message });
  }
};

// @desc    Auto-save a question answer during quiz attempt
// @route   POST /api/quizzes/:id/auto-save
// @access  Student
export const autoSaveAnswer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { attemptId, questionId, studentAnswer } = req.body;
    if (!attemptId || !questionId) {
      res.status(400).json({ message: "attemptId and questionId are required." });
      return;
    }

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      res.status(404).json({ message: "Attempt not found" });
      return;
    }

    if (!attempt.answersSaved) {
      attempt.answersSaved = [];
    }

    const existingIdx = attempt.answersSaved.findIndex(
      (a: any) => a.questionId.toString() === questionId.toString()
    );

    const now = new Date();
    if (existingIdx >= 0 && attempt.answersSaved[existingIdx]) {
      attempt.answersSaved[existingIdx]!.studentAnswer = studentAnswer;
      attempt.answersSaved[existingIdx]!.savedAt = now;
    } else {
      attempt.answersSaved.push({
        questionId: questionId as any,
        studentAnswer,
        savedAt: now
      });
    }

    await attempt.save();
    res.json({ message: "Answer auto-saved", savedAt: now });
  } catch (error: any) {
    console.error("Error auto-saving quiz answer:", error);
    res.status(500).json({ message: "Server Error", error: error?.message });
  }
};

// @desc    Get student's previous attempts for a quiz
// @route   GET /api/quizzes/:id/my-attempts
// @access  Student
export const getMyQuizAttempts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const quizId = req.params.id;
    const studentId = req.user?._id;

    const attempts = await QuizAttempt.find({ quiz: quizId as any, student: studentId as any }).sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error?.message });
  }
};

// @desc    Submit a quiz attempt (Manual or Timer Expiration)
// @route   POST /api/quizzes/:id/attempt
// @access  Student
export const submitQuizAttempt = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const quizId = req.params.id as string;
    const { attemptId, answers, isTimedOut } = req.body; // answers: Array<{ questionId, studentAnswer }>

    if (!quizId || typeof quizId !== 'string' || !mongoose.Types.ObjectId.isValid(quizId)) {
      res.status(400).json({ message: "Invalid Quiz ID" });
      return;
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    let attempt: any = null;
    if (attemptId && typeof attemptId === 'string' && mongoose.Types.ObjectId.isValid(attemptId)) {
      attempt = await QuizAttempt.findById(attemptId);
    }

    // Fallback: If attempt doesn't exist yet, create one
    if (!attempt) {
      attempt = new QuizAttempt({
        quiz: quizId as any,
        student: req.user?._id as any,
        startedAt: new Date(),
        durationSeconds: (quiz.timeLimit || 0) * 60,
        answersSaved: []
      });
    }

    const submittedAnswersList = answers || [];

    let earnedPoints = 0;
    let totalPoints = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const processedAnswers: any[] = [];

    quiz.questions.forEach((q: any) => {
      totalPoints += (q.points || 1);

      // Find submitted or auto-saved answer for this question
      const submittedAns = submittedAnswersList.find(
        (a: any) => a.questionId && a.questionId.toString() === q._id.toString()
      ) || attempt.answersSaved?.find(
        (a: any) => a.questionId && a.questionId.toString() === q._id.toString()
      );

      let isCorrect = false;

      if (submittedAns && submittedAns.studentAnswer && String(submittedAns.studentAnswer).trim() !== '') {
        const studentText = String(submittedAns.studentAnswer).trim().toLowerCase();
        const correctText = String(q.correctAnswer).trim().toLowerCase();

        if (studentText === correctText) {
          isCorrect = true;
          earnedPoints += (q.points || 1);
          correctCount++;
        } else {
          incorrectCount++;
        }

        processedAnswers.push({
          questionId: q._id,
          studentAnswer: submittedAns.studentAnswer,
          isCorrect
        });
      } else {
        // Unanswered question
        unansweredCount++;
        processedAnswers.push({
          questionId: q._id,
          studentAnswer: '',
          isCorrect: false
        });
      }
    });

    const answeredCount = processedAnswers.filter(a => a.studentAnswer && String(a.studentAnswer).trim() !== '').length;

    // Timeout vs Normal Attempt Handling
    const isTimeoutAttempt = Boolean(isTimedOut || (attempt.startedAt && (quiz.timeLimit || 0) > 0 && (new Date().getTime() - new Date(attempt.startedAt).getTime()) > ((quiz.timeLimit || 0) * 60 * 1000 + 10000)));

    const requiredPassingScore = typeof quiz.passingScore === 'number' && quiz.passingScore >= 0 ? quiz.passingScore : 60;
    let scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    // Evaluate initial passed status based on full quiz score
    let passed = scorePercentage >= requiredPassingScore && answeredCount > 0;

    // If attempt timed out, enforce failure if incomplete or below passing score
    if (isTimeoutAttempt) {
      if (answeredCount < quiz.questions.length || scorePercentage < requiredPassingScore) {
        passed = false;
      }
    }

    // Zero out score and earned points if no questions were answered
    if (answeredCount === 0) {
      scorePercentage = 0;
      earnedPoints = 0;
      passed = false;
    }

    // Calculate final earned points using quiz setup totalPoints if specified
    const quizSetupPoints = quiz.totalPoints && quiz.totalPoints > 0 ? quiz.totalPoints : totalPoints;
    if (quiz.totalPoints && quiz.totalPoints > 0 && totalPoints > 0) {
      earnedPoints = Math.round((scorePercentage / 100) * quizSetupPoints);
    }

    let xpEarned = passed ? earnedPoints : 0;

    // Analytics Data Calculation
    const totalDurationMs = attempt.startedAt
      ? Math.max(0, new Date().getTime() - new Date(attempt.startedAt).getTime())
      : 0;

    const existingAttemptsCount = await QuizAttempt.countDocuments({
      quiz: quizId as any,
      student: req.user?._id as any
    });

    // Time per question calculation based on auto-save timestamps
    const timePerQuestion: any[] = [];
    if (attempt.answersSaved && attempt.answersSaved.length > 0) {
      let previousTime = attempt.startedAt ? new Date(attempt.startedAt).getTime() : new Date().getTime();
      attempt.answersSaved.forEach((savedItem: any) => {
        const savedTime = new Date(savedItem.savedAt).getTime();
        const diff = Math.max(0, savedTime - previousTime);
        timePerQuestion.push({
          questionId: savedItem.questionId,
          timeMs: diff
        });
        previousTime = savedTime;
      });
    }

    attempt.score = scorePercentage;
    attempt.earnedPoints = earnedPoints;
    attempt.answers = processedAnswers;
    attempt.passed = passed;
    attempt.xpEarned = xpEarned;
    attempt.isTimedOut = isTimeoutAttempt;
    attempt.status = isTimeoutAttempt ? "Timed Out" : "Completed";
    attempt.attemptedAt = new Date();

    attempt.analytics = {
      attemptNumber: existingAttemptsCount ? existingAttemptsCount + (attempt.isNew ? 1 : 0) : 1,
      totalDurationMs,
      timePerQuestion
    };

    await attempt.save();

    // Notify instructor about quiz attempt
    try {
      const populatedQuiz: any = await Quiz.findById(quizId).populate("course");
      const instructorId = populatedQuiz?.course?.instructor;
      const studentName = req.user?.name || "A student";
      if (instructorId) {
        await sendNotificationToUser(instructorId, {
          title: `Quiz attempted: ${populatedQuiz.title}`,
          message: `${studentName} completed ${populatedQuiz.title} scoring ${scorePercentage}% (${xpEarned} XP earned)`,
          type: "grade",
          linkUrl: `/lecturer/quizzes/${quizId}`,
        });
      }
    } catch (e) {
      console.error("Failed to notify instructor about quiz attempt", e);
    }

    // Award XP points and check badges for student
    try {
      const studentUser = await User.findById(req.user?._id);
      if (studentUser) {
        studentUser.points += xpEarned;
        await studentUser.save();

        await sendNotificationToUser(studentUser._id, {
          title: `Quiz Completed! ⭐ +${xpEarned} XP`,
          message: `You earned ${xpEarned} XP for scoring ${scorePercentage}% in "${quiz.title}".`,
          type: "points",
        });

        await checkAndAwardBadges(studentUser);
      }
    } catch (err) {
      console.error("Failed to award XP points for quiz attempt", err);
    }

    res.status(201).json({
      attempt,
      totalPoints,
      earnedPoints,
      scorePercentage,
      xpEarned,
      metrics: {
        totalQuestions: quiz.questions.length,
        correctCount,
        incorrectCount,
        unansweredCount,
        durationSeconds: Math.round(totalDurationMs / 1000)
      }
    });
  } catch (error: any) {
    console.error("Error submitting quiz attempt:", error);
    res.status(500).json({ message: "Server Error", error: error?.message });
  }
};

// @desc    Get aggregate stats for a quiz (total attempts, average score)
// @route   GET /api/quizzes/:id/stats
// @access  Lecturer, Admin
export const getQuizStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const attempts = await QuizAttempt.find({ quiz: id as any, status: { $in: ['Completed', 'Submitted', 'Timed Out'] } });
    const totalSubmissions = attempts.length;
    let sumScore = 0;

    attempts.forEach((att) => {
      sumScore += att.score || 0;
    });

    const averageScore = totalSubmissions > 0 ? Math.round(sumScore / totalSubmissions) : 0;

    res.json({
      totalSubmissions,
      averageScore
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error?.message });
  }
};

// @desc    Get assigned adaptive final quiz for a student based on course completion, engagement & performance
// @route   GET /api/quizzes/course/:courseId/adaptive-final
// @access  Student
export const getAssignedFinalQuiz = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const courseId = req.params.courseId as string;
    const studentId = req.user?._id;

    if (!courseId || typeof courseId !== 'string' || !mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid Course ID" });
      return;
    }

    const course = await Course.findById(courseId as any);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // 1. Gather all lessons in the course
    const allLessons: any[] = [];
    course.modules?.forEach((m: any) => {
      m.lessons?.forEach((l: any) => {
        allLessons.push(l);
      });
    });

    const totalLessons = allLessons.length;

    // Check completion status from Enrollment and StudentProgress
    const enrollment = await Enrollment.findOne({ course: courseId as any, student: studentId as any });
    const studentProgressDocs = await StudentProgress.find({ course: courseId as any, student: studentId as any });

    const completedLessonIds = new Set<string>();
    if (enrollment?.completedLessons) {
      enrollment.completedLessons.forEach((id: any) => completedLessonIds.add(String(id)));
    }
    studentProgressDocs.forEach((sp) => {
      if (sp.completed && sp.lessonId) {
        completedLessonIds.add(String(sp.lessonId));
      }
    });

    // Count how many course lessons are completed
    let completedCount = 0;
    allLessons.forEach((l) => {
      if (l._id && completedLessonIds.has(String(l._id))) {
        completedCount++;
      }
    });

    const isCourseCompleted = totalLessons > 0 ? completedCount >= totalLessons : true;
    const completionPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 100;

    if (!isCourseCompleted) {
      res.json({
        isUnlocked: false,
        message: `Final quiz is locked. Complete all required course lessons first (${completedCount}/${totalLessons} completed, ${completionPercent}%).`,
        completionPercent,
        completedCount,
        totalLessons
      });
      return;
    }

    // 2. Calculate Learning Performance (Interactive Quiz / Marker Questions Accuracy + Module Quiz Scores)
    let totalQuestionsAttempted = 0;
    let totalQuestionsCorrect = 0;
    let watchPercentSum = 0;
    let lessonCountWithWatch = 0;

    studentProgressDocs.forEach((sp) => {
      if (sp.answeredQuestions && Array.isArray(sp.answeredQuestions)) {
        sp.answeredQuestions.forEach((ans: any) => {
          totalQuestionsAttempted++;
          if (ans.isCorrect) totalQuestionsCorrect++;
        });
      }
      if (typeof sp.watchPercent === 'number') {
        watchPercentSum += sp.watchPercent;
        lessonCountWithWatch++;
      }
    });

    // Also factor in non-final course quiz attempts taken during the course
    const courseQuizzes = await Quiz.find({ course: courseId as any });
    const nonFinalQuizIds = courseQuizzes.filter(q => !q.isFinalQuiz).map(q => q._id);
    const existingAttempts = await QuizAttempt.find({
      student: studentId as any,
      quiz: { $in: nonFinalQuizIds }
    });

    let nonFinalQuizSumScore = 0;
    let nonFinalQuizCount = existingAttempts.length;
    existingAttempts.forEach(att => {
      nonFinalQuizSumScore += (att.score || 0);
    });

    let interactiveAccuracy = totalQuestionsAttempted > 0
      ? (totalQuestionsCorrect / totalQuestionsAttempted) * 100
      : 70; // default baseline if no interactive markers

    let moduleQuizAvg = nonFinalQuizCount > 0
      ? nonFinalQuizSumScore / nonFinalQuizCount
      : interactiveAccuracy;

    const performanceScore = Math.round((interactiveAccuracy * 0.5) + (moduleQuizAvg * 0.5));

    // 3. Calculate Learning Engagement Level
    const avgWatchPercent = lessonCountWithWatch > 0 ? watchPercentSum / lessonCountWithWatch : 85;
    let questionParticipationRate = totalLessons > 0 ? Math.min(100, Math.round((studentProgressDocs.length / totalLessons) * 100)) : 100;
    const engagementScore = Math.round((avgWatchPercent * 0.6) + (questionParticipationRate * 0.4));

    // 4. Calculate Composite Adaptive Score (65% Performance, 35% Engagement)
    const compositeScore = Math.round((performanceScore * 0.65) + (engagementScore * 0.35));

    // 5. Determine Assigned Difficulty Level
    let assignedDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    let assignmentReason = '';

    if (compositeScore < 50) {
      assignedDifficulty = 'Easy';
      assignmentReason = `Assigned Easy quiz based on demonstrated foundation performance & engagement level (${compositeScore}%).`;
    } else if (compositeScore < 75) {
      assignedDifficulty = 'Medium';
      assignmentReason = `Assigned Medium quiz based on moderate performance & steady learning engagement (${compositeScore}%).`;
    } else {
      assignedDifficulty = 'Hard';
      assignmentReason = `Assigned Hard quiz based on high accuracy performance & strong engagement level (${compositeScore}%).`;
    }

    // 6. Query available quizzes for this course
    const allCourseQuizzes = await Quiz.find({ course: courseId as any, isPublished: true });

    // Find final quiz matching assigned difficulty
    let assignedQuiz = allCourseQuizzes.find(
      q => (q.isFinalQuiz || q.title.toLowerCase().includes('final')) && q.difficultyLevel === assignedDifficulty
    );

    // If no explicit final quiz with assigned difficulty, look for any quiz with assigned difficulty
    if (!assignedQuiz) {
      assignedQuiz = allCourseQuizzes.find(q => q.difficultyLevel === assignedDifficulty);
    }

    // Fallback: If exact difficulty quiz isn't created yet by lecturer, fallback to closest available final/regular quiz
    if (!assignedQuiz && allCourseQuizzes.length > 0) {
      assignedQuiz = allCourseQuizzes.find(q => q.isFinalQuiz) || allCourseQuizzes[0];
    }

    res.json({
      isUnlocked: true,
      completionPercent,
      completedCount,
      totalLessons,
      performanceScore,
      engagementScore,
      compositeScore,
      assignedDifficulty,
      assignmentReason,
      assignedQuiz: assignedQuiz || null,
      availableQuizCount: allCourseQuizzes.length
    });
  } catch (error: any) {
    console.error("Error determining adaptive final quiz:", error);
    res.status(500).json({ message: "Server Error", error: error?.message });
  }
};
