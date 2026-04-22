import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  fileUrl: string; // The uploaded file path or cloud URL
  studentNotes?: string;
  submittedAt: Date;
  status: 'Pending Grade' | 'Graded';
  score?: number;
  feedback?: string;
  isLate: boolean;
}

const SubmissionSchema = new Schema<ISubmission>({
  assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  studentNotes: { type: String },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending Grade', 'Graded'], default: 'Pending Grade' },
  score: { type: Number },
  feedback: { type: String },
  isLate: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
