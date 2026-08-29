import mongoose, { Schema } from 'mongoose';
const AssignmentSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    points: { type: Number, required: true },
    deadline: { type: Date, required: true },
    latePenaltyPercent: { type: Number, default: 0 },
    submissionType: { type: String, default: 'File Upload (PDF, DOCX, ZIP)' },
    referenceMaterials: [{ type: String }],
    rubric: [{
            criteria: { type: String, required: true },
            points: { type: Number, required: true }
        }],
    isPublished: { type: Boolean, default: false }
}, {
    timestamps: true
});
export default mongoose.model('Assignment', AssignmentSchema);
