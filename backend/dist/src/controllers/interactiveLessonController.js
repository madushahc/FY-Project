import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import StudentProgress from "../models/StudentProgress.js";
import Enrollment from "../models/Enrollment.js";
// Helper to locate a lesson inside a course structure
const findLessonInCourse = (course, lessonId) => {
    if (!course || !course.modules)
        return { lesson: null, moduleId: null };
    for (const mod of course.modules) {
        for (const les of mod.lessons) {
            if (les._id?.toString() === lessonId || les.title === lessonId) {
                return { lesson: les, moduleId: mod._id?.toString() || null };
            }
        }
    }
    return { lesson: null, moduleId: null };
};
// Helper to safely find or create student progress handling concurrent creation race conditions (E11000)
const findOrCreateStudentProgress = async (student, course, lessonId) => {
    let progress = await StudentProgress.findOne({ student, course, lessonId });
    if (!progress) {
        try {
            progress = await StudentProgress.create({
                student,
                course,
                lessonId,
                scannedQrCodes: [],
                answeredQuestions: [],
                watchPercent: 0,
                maxWatchedTime: 0,
                videoWatched: false
            });
        }
        catch (err) {
            if (err.code === 11000) {
                progress = await StudentProgress.findOne({ student, course, lessonId });
            }
            else {
                throw err;
            }
        }
    }
    return progress;
};
// Check and trigger lesson completion if all QR, question markers, and watch percentage requirements are satisfied
const checkAndMarkLessonCompletion = async (studentId, courseId, lessonId, lesson) => {
    const progress = await StudentProgress.findOne({ student: studentId, course: courseId, lessonId });
    if (!progress)
        return false;
    const totalQrRequired = lesson.qrMarkers?.length || 0;
    const totalQuestionsRequired = lesson.questionMarkers?.length || 0;
    const scannedCount = progress.scannedQrCodes?.length || 0;
    const correctlyAnsweredCount = progress.answeredQuestions?.filter(q => q.isCorrect).length || 0;
    const allQrScanned = totalQrRequired === 0 || scannedCount >= totalQrRequired;
    const allQuestionsPassed = totalQuestionsRequired === 0 || correctlyAnsweredCount >= totalQuestionsRequired;
    const course = await Course.findById(courseId);
    const minWatchPercent = course?.completionRules?.minLessonWatchPercent || 95;
    const typeStr = (lesson.type || '').toLowerCase();
    const isReadingLesson = typeStr === 'reading';
    const isNonVideoType = typeStr === 'reading' || typeStr === 'assignment' || typeStr === 'quiz' || typeStr === 'link';
    const isVideoLesson = typeStr === 'video' || (!isNonVideoType && Boolean(lesson.contentUrl || lesson.videoUrl));
    const isVideoSatisfied = !isVideoLesson || Boolean(progress.videoWatched) || ((progress.watchPercent || 0) >= minWatchPercent);
    const isReadingSatisfied = !isReadingLesson || ((progress.watchPercent || 0) >= 90);
    // Require at least one completion criterion to exist (video, reading, QR, or question).
    const hasAnyRequirement = totalQrRequired > 0 || totalQuestionsRequired > 0 || isVideoLesson || isReadingLesson;
    if (hasAnyRequirement && allQrScanned && allQuestionsPassed && isVideoSatisfied && isReadingSatisfied) {
        progress.completed = true;
        if (!progress.completedAt) {
            progress.completedAt = new Date();
        }
        if (isVideoLesson) {
            progress.videoWatched = true;
        }
        await progress.save();
        // Mark in Enrollment if not already completed
        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
        if (enrollment) {
            const lessonObjId = mongoose.Types.ObjectId.isValid(lessonId)
                ? new mongoose.Types.ObjectId(lessonId)
                : lessonId;
            const alreadyCompleted = enrollment.completedLessons.some(id => id.toString() === String(lessonId));
            if (!alreadyCompleted) {
                enrollment.completedLessons.push(lessonObjId);
                // Calculate progress percentage
                let totalLessons = 0;
                course?.modules.forEach(m => totalLessons += m.lessons.length);
                if (totalLessons > 0) {
                    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
                }
                await enrollment.save();
            }
        }
        return true;
    }
    return progress.completed;
};
// @desc Record QR Code scan by student during video playback
// @route POST /api/courses/:courseId/lessons/:lessonId/qr-scan
export const recordQrScan = async (req, res) => {
    try {
        let courseId = String(req.params.courseId || req.body.courseId || "");
        let lessonId = String(req.params.lessonId || req.body.lessonId || "");
        const { code } = req.body;
        const userId = req.user?._id?.toString();
        if (!userId || !code) {
            res.status(401).json({ message: "Not authorized or missing QR code parameter" });
            return;
        }
        let course = null;
        let lesson = null;
        if (courseId && lessonId) {
            course = await Course.findById(courseId);
            if (course) {
                lesson = findLessonInCourse(course, lessonId).lesson;
            }
        }
        // Auto-discover course & lesson by QR code if missing
        if (!course || !lesson) {
            const courses = await Course.find();
            for (const c of courses) {
                for (const m of c.modules) {
                    for (const l of m.lessons) {
                        if (l.qrMarkers?.some((q) => q.code === code || q._id?.toString() === code)) {
                            course = c;
                            lesson = l;
                            courseId = c._id.toString();
                            lessonId = l._id?.toString() || "";
                            break;
                        }
                    }
                    if (lesson)
                        break;
                }
                if (lesson)
                    break;
            }
        }
        if (!course || !lesson) {
            res.status(404).json({ message: "Invalid or unknown QR code" });
            return;
        }
        // Match QR marker
        const qrMarker = lesson.qrMarkers?.find((q) => q.code === code || q._id?.toString() === code);
        if (!qrMarker) {
            res.status(400).json({ message: "Invalid or unknown QR code for this lesson" });
            return;
        }
        let progress = await findOrCreateStudentProgress(userId, courseId, lessonId);
        const isAlreadyScanned = progress.scannedQrCodes.includes(qrMarker.code);
        let pointsAwarded = 0;
        if (!isAlreadyScanned) {
            progress.scannedQrCodes.push(qrMarker.code);
            pointsAwarded = qrMarker.points || 15;
            progress.totalPointsEarned += pointsAwarded;
            await progress.save();
            // Award points to User model
            await User.findByIdAndUpdate(userId, { $inc: { points: pointsAwarded } });
        }
        const isLessonCompleted = await checkAndMarkLessonCompletion(userId, courseId, lessonId, lesson);
        const updatedUser = await User.findById(userId).select("points");
        res.json({
            success: true,
            message: isAlreadyScanned ? "QR Code already scanned" : `QR Code scanned! +${pointsAwarded} points`,
            pointsAwarded,
            totalPoints: updatedUser?.points || 0,
            scannedQrCodes: progress.scannedQrCodes,
            isLessonCompleted
        });
    }
    catch (error) {
        console.error("Error recording QR scan:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// @desc Record Answer to an in-video question
// @route POST /api/courses/:courseId/lessons/:lessonId/answer
export const recordQuestionAnswer = async (req, res) => {
    try {
        const courseId = String(req.params.courseId || "");
        const lessonId = String(req.params.lessonId || "");
        const { questionMarkerId, selectedOption, studentResponse, timeTaken = 0 } = req.body;
        const userId = req.user?._id?.toString();
        if (!userId || !courseId || !lessonId) {
            res.status(401).json({ message: "Not authorized or invalid parameters" });
            return;
        }
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const { lesson } = findLessonInCourse(course, lessonId);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        const qMarker = lesson.questionMarkers?.find(q => q._id?.toString() === questionMarkerId);
        if (!qMarker) {
            res.status(400).json({ message: "Question marker not found" });
            return;
        }
        let isCorrect = false;
        const qType = qMarker.questionType || 'mcq';
        if (qType === 'matching') {
            // Validate term matching pairs: studentResponse expected as { [term]: definition }
            if (studentResponse && qMarker.matchingPairs) {
                isCorrect = qMarker.matchingPairs.every(pair => studentResponse[pair.term] === pair.definition);
            }
        }
        else {
            // MCQ or True-False
            isCorrect = Number(selectedOption) === Number(qMarker.correctOption);
        }
        let progress = await findOrCreateStudentProgress(userId, courseId, lessonId);
        const existingAnswerIdx = progress.answeredQuestions.findIndex(q => q.questionMarkerId === questionMarkerId);
        const prevRecord = existingAnswerIdx >= 0 ? progress.answeredQuestions[existingAnswerIdx] : null;
        const previouslyCorrect = prevRecord ? Boolean(prevRecord.isCorrect) : false;
        const currentAttempts = (prevRecord?.attempts || 0) + 1;
        let pointsAwarded = 0;
        if (isCorrect && !previouslyCorrect) {
            pointsAwarded = qMarker.points || 20;
            progress.totalPointsEarned += pointsAwarded;
            // Award user points
            await User.findByIdAndUpdate(userId, { $inc: { points: pointsAwarded } });
        }
        const answerRecord = {
            questionMarkerId,
            selectedOption: selectedOption !== undefined && selectedOption !== null ? Number(selectedOption) : undefined,
            studentResponse: studentResponse !== undefined ? studentResponse : selectedOption,
            activityType: qType,
            isCorrect,
            attempts: currentAttempts,
            timeTaken: Number(timeTaken) || 0,
            pointsEarned: pointsAwarded,
            answeredAt: new Date()
        };
        if (existingAnswerIdx >= 0) {
            progress.answeredQuestions[existingAnswerIdx] = answerRecord;
        }
        else {
            progress.answeredQuestions.push(answerRecord);
        }
        await progress.save();
        const isLessonCompleted = await checkAndMarkLessonCompletion(userId, courseId, lessonId, lesson);
        const updatedUser = await User.findById(userId).select("points");
        res.json({
            isCorrect,
            correctOption: qMarker.correctOption,
            matchingPairs: qMarker.matchingPairs || [],
            explanation: qMarker.explanation || "",
            pointsAwarded,
            attempts: currentAttempts,
            timeTaken: Number(timeTaken) || 0,
            totalPoints: updatedUser?.points || 0,
            answeredQuestions: progress.answeredQuestions,
            isLessonCompleted
        });
    }
    catch (error) {
        console.error("Error recording question answer:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// @desc Record video watch progress percentage
// @route POST /api/courses/:courseId/lessons/:lessonId/watch-progress
export const recordWatchProgress = async (req, res) => {
    try {
        const courseId = String(req.params.courseId || "");
        const lessonId = String(req.params.lessonId || "");
        const { watchPercent = 0, currentTime = 0 } = req.body;
        const userId = req.user?._id?.toString();
        if (!userId || !courseId || !lessonId) {
            res.status(401).json({ message: "Not authorized or invalid parameters" });
            return;
        }
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const { lesson } = findLessonInCourse(course, lessonId);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        let progress = await findOrCreateStudentProgress(userId, courseId, lessonId);
        const newWatchPercent = Math.min(100, Math.max(progress.watchPercent || 0, Number(watchPercent) || 0));
        const newMaxWatchedTime = Math.max(progress.maxWatchedTime || 0, Number(currentTime) || 0);
        progress.watchPercent = newWatchPercent;
        progress.maxWatchedTime = newMaxWatchedTime;
        const minWatchPercent = course?.completionRules?.minLessonWatchPercent || 95;
        if (newWatchPercent >= minWatchPercent) {
            progress.videoWatched = true;
        }
        await progress.save();
        const isLessonCompleted = await checkAndMarkLessonCompletion(userId, courseId, lessonId, lesson);
        res.json({
            success: true,
            watchPercent: progress.watchPercent,
            maxWatchedTime: progress.maxWatchedTime,
            videoWatched: progress.videoWatched,
            minWatchPercentRequired: minWatchPercent,
            isLessonCompleted
        });
    }
    catch (error) {
        console.error("Error recording watch progress:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// @desc Get current student's progress for a specific lesson
// @route GET /api/courses/:courseId/lessons/:lessonId/progress
export const getLessonProgress = async (req, res) => {
    try {
        const courseId = String(req.params.courseId || "");
        const lessonId = String(req.params.lessonId || "");
        const userId = req.user?._id?.toString();
        if (!userId || !courseId || !lessonId) {
            res.status(401).json({ message: "Not authorized or invalid parameters" });
            return;
        }
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const { lesson } = findLessonInCourse(course, lessonId);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        const progress = await StudentProgress.findOne({ student: userId, course: courseId, lessonId });
        const totalQr = lesson.qrMarkers?.length || 0;
        const totalQuestions = lesson.questionMarkers?.length || 0;
        const scannedCount = progress?.scannedQrCodes?.length || 0;
        const answeredCorrectCount = progress?.answeredQuestions?.filter(q => q.isCorrect).length || 0;
        const minWatchPercent = course?.completionRules?.minLessonWatchPercent || 95;
        const typeStr = (lesson.type || '').toLowerCase();
        const isNonVideoType = typeStr === 'reading' || typeStr === 'assignment' || typeStr === 'quiz' || typeStr === 'link';
        const isVideoLesson = typeStr === 'video' || (!isNonVideoType && Boolean(lesson.contentUrl || lesson.videoUrl));
        const watchPercent = progress?.watchPercent || 0;
        // For video lessons: videoWatched is true when the watch threshold is met.
        // For non-video lessons: we do not use the watch gate; they complete via activities or explicit marking.
        const videoWatched = isVideoLesson
            ? (Boolean(progress?.videoWatched) || watchPercent >= minWatchPercent)
            : true; // non-video lessons don't have a watch gate
        const isReadingLesson = typeStr === 'reading';
        const isReadingSatisfied = !isReadingLesson || watchPercent >= 90;
        const hasAnyRequirement = totalQr > 0 || totalQuestions > 0 || isVideoLesson || isReadingLesson;
        const allActivitiesMet = (totalQr === 0 || scannedCount >= totalQr) &&
            (totalQuestions === 0 || answeredCorrectCount >= totalQuestions) &&
            videoWatched &&
            isReadingSatisfied;
        const isCompleted = Boolean(progress?.completed) || (hasAnyRequirement && allActivitiesMet);
        res.json({
            scannedQrCodes: progress?.scannedQrCodes || [],
            answeredQuestions: progress?.answeredQuestions || [],
            watchPercent,
            maxWatchedTime: progress?.maxWatchedTime || 0,
            videoWatched,
            minWatchPercentRequired: minWatchPercent,
            completed: isCompleted,
            completedAt: progress?.completedAt || null,
            totalPointsEarned: progress?.totalPointsEarned || 0,
            totalQrRequired: totalQr,
            totalQuestionsRequired: totalQuestions,
            allRequirementsMet: isCompleted
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// @desc Get interactive video analytics for Admin & Lecturer
// @route GET /api/courses/analytics/interactive
export const getInteractiveAnalytics = async (req, res) => {
    try {
        const userRole = req.user?.role;
        const userId = req.user?._id;
        if (userRole !== "Admin" && userRole !== "Lecturer") {
            res.status(403).json({ message: "Forbidden: Lecturer or Admin only" });
            return;
        }
        // Filter courses based on user role
        const courseFilter = userRole === "Lecturer" ? { instructor: userId } : {};
        const courses = await Course.find(courseFilter).populate("instructor", "name email");
        const courseIds = courses.map(c => c._id);
        const allProgress = await StudentProgress.find({ course: { $in: courseIds } })
            .populate("student", "name email points profilePhoto")
            .populate("course", "title code");
        let totalQrScans = 0;
        let totalQuestionsAttempted = 0;
        let totalQuestionsCorrect = 0;
        let totalInteractivePoints = 0;
        let totalResponseTimeSecs = 0;
        let totalAttemptsCount = 0;
        allProgress.forEach(p => {
            totalQrScans += p.scannedQrCodes.length;
            totalQuestionsAttempted += p.answeredQuestions.length;
            totalQuestionsCorrect += p.answeredQuestions.filter(q => q.isCorrect).length;
            totalInteractivePoints += p.totalPointsEarned;
            p.answeredQuestions.forEach(q => {
                totalResponseTimeSecs += (q.timeTaken || 0);
                totalAttemptsCount += (q.attempts || 1);
            });
        });
        const questionAccuracyRate = totalQuestionsAttempted > 0
            ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
            : 0;
        const avgResponseTimeSecs = totalQuestionsAttempted > 0
            ? Math.round(totalResponseTimeSecs / totalQuestionsAttempted)
            : 0;
        const avgAttemptsPerQuestion = totalQuestionsAttempted > 0
            ? (totalAttemptsCount / totalQuestionsAttempted).toFixed(1)
            : "1.0";
        // Aggregate by lesson
        const lessonStatsMap = {};
        courses.forEach(course => {
            course.modules.forEach(mod => {
                mod.lessons.forEach(les => {
                    if ((les.qrMarkers?.length || 0) > 0 || (les.questionMarkers?.length || 0) > 0) {
                        const lesIdStr = les._id?.toString() || les.title;
                        lessonStatsMap[lesIdStr] = {
                            courseTitle: course.title,
                            courseCode: course.code,
                            moduleTitle: mod.title,
                            lessonTitle: les.title,
                            lessonType: les.type,
                            qrCount: les.qrMarkers?.length || 0,
                            questionCount: les.questionMarkers?.length || 0,
                            studentsParticipated: new Set(),
                            qrScansCount: 0,
                            questionsCorrectCount: 0,
                            totalTimeTaken: 0,
                            attemptsCount: 0
                        };
                    }
                });
            });
        });
        allProgress.forEach(p => {
            const stat = lessonStatsMap[p.lessonId];
            if (stat) {
                if (p.student) {
                    const sObj = p.student;
                    stat.studentsParticipated.add(sObj._id?.toString() || sObj.toString());
                }
                stat.qrScansCount += p.scannedQrCodes.length;
                stat.questionsCorrectCount += p.answeredQuestions.filter(q => q.isCorrect).length;
                p.answeredQuestions.forEach(q => {
                    stat.totalTimeTaken += (q.timeTaken || 0);
                    stat.attemptsCount += (q.attempts || 1);
                });
            }
        });
        const lessonAnalytics = Object.values(lessonStatsMap).map(s => ({
            ...s,
            studentsParticipatedCount: s.studentsParticipated.size,
            avgResponseTimeSecs: s.questionsCorrectCount > 0 ? Math.round(s.totalTimeTaken / (s.questionsCorrectCount || 1)) : 0,
            studentsParticipated: undefined
        }));
        // Student summary report
        const studentSummaryMap = {};
        allProgress.forEach(p => {
            const studentObj = p.student;
            if (!studentObj || !studentObj._id)
                return;
            const sId = studentObj._id.toString();
            if (!studentSummaryMap[sId]) {
                studentSummaryMap[sId] = {
                    studentId: sId,
                    name: studentObj.name,
                    email: studentObj.email,
                    totalQrScanned: 0,
                    totalQuestionsAnswered: 0,
                    totalInteractivePoints: 0,
                    lessonsEngaged: 0,
                    totalTimeTaken: 0,
                    attemptsCount: 0
                };
            }
            studentSummaryMap[sId].totalQrScanned += p.scannedQrCodes.length;
            studentSummaryMap[sId].totalQuestionsAnswered += p.answeredQuestions.filter(q => q.isCorrect).length;
            studentSummaryMap[sId].totalInteractivePoints += p.totalPointsEarned;
            studentSummaryMap[sId].lessonsEngaged += 1;
            p.answeredQuestions.forEach(q => {
                studentSummaryMap[sId].totalTimeTaken += (q.timeTaken || 0);
                studentSummaryMap[sId].attemptsCount += (q.attempts || 1);
            });
        });
        res.json({
            summary: {
                totalInteractiveCourses: courses.length,
                totalQrScans,
                totalQuestionsAttempted,
                totalQuestionsCorrect,
                questionAccuracyRate,
                avgResponseTimeSecs,
                avgAttemptsPerQuestion,
                totalInteractivePoints
            },
            lessonAnalytics,
            studentSummary: Object.values(studentSummaryMap)
        });
    }
    catch (error) {
        console.error("Error in interactive analytics:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//# sourceMappingURL=interactiveLessonController.js.map