import mongoose, { Schema } from 'mongoose';
const QuizAttemptSchema = new Schema({
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    earnedPoints: { type: Number, required: true },
    answers: [
        {
            questionId: { type: Schema.Types.ObjectId, required: true },
            studentAnswer: { type: String, required: true },
            isCorrect: { type: Boolean, required: true }
        }
    ],
    passed: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
export default mongoose.model('QuizAttempt', QuizAttemptSchema);
//# sourceMappingURL=QuizAttempt.js.map