import mongoose, { Schema } from 'mongoose';
const StudentProgressSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lessonId: { type: String, required: true },
    answeredQuestions: [
        {
            questionMarkerId: { type: String, required: true },
            questionText: { type: String },
            selectedOption: { type: Number },
            selectedAnswerText: { type: String },
            correctAnswerText: { type: String },
            studentResponse: { type: Schema.Types.Mixed },
            activityType: { type: String, default: 'mcq' },
            isCorrect: { type: Boolean, required: true },
            attempts: { type: Number, default: 1 },
            timeTaken: { type: Number, default: 0 },
            pointsEarned: { type: Number, default: 0 },
            answeredAt: { type: Date, default: Date.now }
        }
    ],
    watchPercent: { type: Number, default: 0 },
    maxWatchedTime: { type: Number, default: 0 },
    pauseCount: { type: Number, default: 0 },
    rewatchCount: { type: Number, default: 0 },
    totalPlayDuration: { type: Number, default: 0 },
    videoWatched: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    totalPointsEarned: { type: Number, default: 0 },
    quizSummary: {
        totalQuizzesAttempted: { type: Number, default: 0 },
        quizCorrectCount: { type: Number, default: 0 },
        quizIncorrectCount: { type: Number, default: 0 },
        totalQuizTimeTakenSecs: { type: Number, default: 0 }
    },
    assignmentSummary: {
        totalAssignmentsSubmitted: { type: Number, default: 0 },
        gradedCount: { type: Number, default: 0 },
        totalAssignmentPoints: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});
StudentProgressSchema.index({ student: 1, course: 1, lessonId: 1 }, { unique: true });
export default mongoose.model('StudentProgress', StudentProgressSchema);
