import mongoose, { Schema } from 'mongoose';
const SubmissionSchema = new Schema({
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    studentNotes: { type: String },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending Grade', 'Graded'], default: 'Pending Grade' },
    score: { type: Number },
    feedback: { type: String },
    isLate: { type: Boolean, default: false },
    rubricGrades: [{
            criteria: { type: String, required: true },
            points: { type: Number, required: true },
            score: { type: Number, required: true }
        }]
}, {
    timestamps: true
});
export default mongoose.model('Submission', SubmissionSchema);
//# sourceMappingURL=Submission.js.map