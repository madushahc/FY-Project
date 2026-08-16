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
  // New fields for attempt lifecycle and analytics
  startedAt?: Date;               // when the attempt began (timer start)
  durationSeconds?: number;       // allotted duration for the attempt
  answersSaved: {
    questionId: mongoose.Types.ObjectId;
    studentAnswer: string;
    savedAt: Date;
  }[];                             // incremental auto‑saves
  xpEarned?: number;              // XP awarded for this attempt
  isTimedOut?: boolean;           // Whether attempt timed out
  status?: string;                // 'Completed' | 'Timed Out'
  analytics?: {
    attemptNumber?: number;       // nth attempt for this student & quiz
    totalDurationMs?: number;     // actual time spent
    timePerQuestion: {
      questionId: mongoose.Types.ObjectId;
      timeMs: number;
    }[];
  };
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
      studentAnswer: { type: String, default: '' },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  startedAt: { type: Date },
  durationSeconds: { type: Number },
  answersSaved: [
    {
      questionId: { type: Schema.Types.ObjectId, required: true },
      studentAnswer: { type: String, default: '' },
      savedAt: { type: Date, default: Date.now }
    }
  ],
  xpEarned: { type: Number },
  isTimedOut: { type: Boolean, default: false },
  status: { type: String, default: 'Completed' },
  analytics: {
    attemptNumber: { type: Number },
    totalDurationMs: { type: Number },
    timePerQuestion: [
      {
        questionId: { type: Schema.Types.ObjectId, required: true },
        timeMs: { type: Number, required: true }
      }
    ]
  },
  passed: { type: Boolean, required: true },
  attemptedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
