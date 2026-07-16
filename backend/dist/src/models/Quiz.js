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
            points: { type: Number, default: 1 }
        }
    ],
    timeLimit: { type: Number },
    passingScore: { type: Number, default: 60 },
    isPublished: { type: Boolean, default: false },
    dueDate: { type: Date }
}, {
    timestamps: true
});
export default mongoose.model('Quiz', QuizSchema);
//# sourceMappingURL=Quiz.js.map