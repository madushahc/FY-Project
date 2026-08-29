import mongoose, { Schema } from 'mongoose';
const QuizAttemptSchema = new Schema({
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    earnedPoints: { type: Number, required: true },
    answers: [
        {
            questionId: { type: Schema.Types.ObjectId, required: true },
            studentAnswer: { type: String, default: '' },
            isCorrect: { type: Boolean, required: true }
        }
    ],
    startedAt: { type: Date },
    durationSeconds: { type: Number },
    answersSaved: [
        {
            questionId: { type: Schema.Types.ObjectId, required: true },
            studentAnswer: { type: String, default: '' },
            savedAt: { type: Date, default: Date.now }
        }
    ],
    xpEarned: { type: Number },
    isTimedOut: { type: Boolean, default: false },
    status: { type: String, default: 'Completed' },
    analytics: {
        attemptNumber: { type: Number },
        totalDurationMs: { type: Number },
        timePerQuestion: [
            {
                questionId: { type: Schema.Types.ObjectId, required: true },
                timeMs: { type: Number, required: true }
            }
        ]
    },
    passed: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
export default mongoose.model('QuizAttempt', QuizAttemptSchema);
