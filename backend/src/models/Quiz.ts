import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[]; // for multiple choice
  correctAnswer: string;
  hiddenPrompt?: string; // Invisible research prompt / AI watermark
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
  maxAttempts?: number; // null or undefined for unlimited
  oneAttemptOnly?: boolean; // true if only a single attempt allowed
  attemptsAllowed?: number; // total attempts allowed (999 or number)
  totalPoints?: number; // total quiz points
  difficultyLevel?: 'Easy' | 'Medium' | 'Hard';
  isFinalQuiz?: boolean;
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

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
