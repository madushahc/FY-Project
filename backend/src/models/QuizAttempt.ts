import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt extends Document {
  quiz: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  score: number; // calculated percentage
  earnedPoints: number; // sum of correct question points
  answers: {
    questionId: mongoose.Types.ObjectId;
    studentAnswer: string;
    isCorrect: boolean;
  }[];
  passed: boolean;
  attemptedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  earnedPoints: { type: Number, required: true },
  answers: [
    {
      questionId: { type: Schema.Types.ObjectId, required: true },
      studentAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  passed: { type: Boolean, required: true },
  attemptedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
