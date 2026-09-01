import mongoose, { Schema } from 'mongoose';
const EnrollmentSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: Schema.Types.ObjectId }]
}, {
    timestamps: true
});
export default mongoose.model('Enrollment', EnrollmentSchema);
