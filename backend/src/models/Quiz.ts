import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[]; // for multiple choice
  correctAnswer: string;
  points: number;
}

export interface IQuiz extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  questions: IQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage (e.g. 60)
  isPublished: boolean;
  dueDate?: Date;
}

const QuizSchema = new Schema<IQuiz>({
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

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
