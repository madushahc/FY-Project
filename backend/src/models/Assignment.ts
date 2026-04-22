import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  instructions: string;
  points: number;
  deadline: Date;
  latePenaltyPercent: number;
  submissionType: string;
  referenceMaterials: string[]; // URLs to attachments
  rubric: {
    criteria: string;
    points: number;
  }[];
  isPublished: boolean;
}

const AssignmentSchema = new Schema<IAssignment>({
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

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
