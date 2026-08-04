import mongoose, { Schema } from 'mongoose';
const StudentProgressSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lessonId: { type: String, required: true },
    scannedQrCodes: [{ type: String }],
    answeredQuestions: [
        {
            questionMarkerId: { type: String, required: true },
            selectedOption: { type: Number },
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
    videoWatched: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    totalPointsEarned: { type: Number, default: 0 }
}, {
    timestamps: true
});
StudentProgressSchema.index({ student: 1, course: 1, lessonId: 1 }, { unique: true });
export default mongoose.model('StudentProgress', StudentProgressSchema);
//# sourceMappingURL=StudentProgress.js.map