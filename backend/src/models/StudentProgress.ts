import mongoose, { Document, Schema } from 'mongoose';

export interface IAnsweredQuestion {
  questionMarkerId: string;
  selectedOption?: number | undefined;
  studentResponse?: any;
  activityType?: string | undefined; // 'mcq' | 'true-false' | 'matching'
  isCorrect: boolean;
  attempts: number;
  timeTaken: number; // In seconds
  pointsEarned: number;
  answeredAt: Date;
}

export interface IStudentProgress extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  lessonId: string;
  answeredQuestions: IAnsweredQuestion[];
  watchPercent: number; // 0 to 100 percentage watched
  maxWatchedTime: number; // max timestamp in seconds reached
  videoWatched: boolean; // whether required watch percentage threshold reached
  completed: boolean;
  completedAt?: Date;
  totalPointsEarned: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentProgressSchema = new Schema<IStudentProgress>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: String, required: true },
  answeredQuestions: [
    {
      questionMarkerId: { type: String, required: true },
      selectedOption: { type: Number },
      studentResponse: { type: Schema.Types.Mixed },
      activityType: { type: String, default: 'mcq' },
      isCorrect: { type: Boolean, required: true },
      attempts: { type: Number, default: 1 },
      timeTaken: { type: Number, default: 0 },
      pointsEarned: { type: Number, default: 0 },
      answeredAt: { type: Date, default: Date.now }
    }
  ],
  watchPercent: { type: Number, default: 0 },
  maxWatchedTime: { type: Number, default: 0 },
  videoWatched: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  totalPointsEarned: { type: Number, default: 0 }
}, {
  timestamps: true
});

StudentProgressSchema.index({ student: 1, course: 1, lessonId: 1 }, { unique: true });

export default mongoose.model<IStudentProgress>('StudentProgress', StudentProgressSchema);
