import mongoose, { Schema } from 'mongoose';
const QuizSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [
        {
            text: { type: String, required: true },
            type: { type: String, enum: ['multiple-choice', 'true-false', 'short-answer'], required: true },
            options: [{ type: String }],
            correctAnswer: { type: String, required: true },
            hiddenPrompt: { type: String, default: '' },
            points: { type: Number, default: 1 }
        }
    ],
    timeLimit: { type: Number },
    passingScore: { type: Number, default: 60 },
    isPublished: { type: Boolean, default: false },
    dueDate: { type: Date },
    maxAttempts: { type: Number, default: null }, // null = unlimited
    oneAttemptOnly: { type: Boolean, default: false },
    attemptsAllowed: { type: Number },
    totalPoints: { type: Number, default: 100 },
    difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    isFinalQuiz: { type: Boolean, default: false }
}, {
    timestamps: true
});
export default mongoose.model('Quiz', QuizSchema);
