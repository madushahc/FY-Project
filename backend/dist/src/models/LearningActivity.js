import mongoose, { Schema } from 'mongoose';
const LearningActivitySchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lessonId: { type: String },
    activityType: {
        type: String,
        enum: ['login', 'lesson_access', 'video_play', 'video_pause', 'video_rewatch', 'question_attempt', 'quiz_attempt', 'assignment_submission'],
        required: true
    },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true
});
LearningActivitySchema.index({ student: 1, course: 1, activityType: 1, timestamp: -1 });
export default mongoose.model('LearningActivity', LearningActivitySchema);
//# sourceMappingURL=LearningActivity.js.map