import mongoose, { Document, Schema } from 'mongoose';

export interface IMatchingPair {
  term: string;
  definition: string;
}

export interface IQuestionMarker {
  _id?: mongoose.Types.ObjectId;
  timestamp: number; // In seconds (or scroll percentage for reading materials)
  questionText: string;
  questionType?: 'mcq' | 'true-false' | 'matching';
  options: string[];
  correctOption: number; // For MCQ / True-False
  matchingPairs?: IMatchingPair[]; // For matching task
  explanation?: string;
  points?: number;
}

export interface ILesson {
  _id?: mongoose.Types.ObjectId;
  title: string;
  type: 'video' | 'quiz' | 'assignment' | 'reading' | 'link';
  contentUrl?: string; // For video/link/reading
  duration?: number; // In minutes
  refId?: mongoose.Types.ObjectId; // Reference to Quiz or Assignment if type matches
  points?: number; // Gamification points for completing this specific lesson
  description?: string;
  questionMarkers?: IQuestionMarker[];
}

export interface IModule {
  _id?: mongoose.Types.ObjectId;
  title: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  code: string;
  department?: string;
  description: string;
  creditHours?: number;
  academicYear?: string;
  startDate?: Date;
  endDate?: Date;
  maxEnrollment?: number;
  difficultyLevel?: string;
  thumbnailUrl?: string;
  instructor: mongoose.Types.ObjectId;
  modules: IModule[];
  category: string;
  status: 'Published' | 'Draft';
  enrollmentType: 'Open' | 'Restricted';
  
  // Gamification & Completion rules
  completionRules?: {
    minLessonWatchPercent: number;
    minQuizPassScore: number;
    requireAllAssignments: boolean;
  };
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  code: { type: String, required: true },
  department: { type: String },
  description: { type: String, required: true },
  creditHours: { type: Number },
  academicYear: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  maxEnrollment: { type: Number },
  difficultyLevel: { type: String },
  thumbnailUrl: { type: String },
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [
    {
      title: { type: String, required: true },
      lessons: [
        {
          title: { type: String, required: true },
          type: { type: String, enum: ['video', 'quiz', 'assignment', 'reading', 'link'], required: true },
          contentUrl: { type: String },
          duration: { type: Number },
          refId: { type: Schema.Types.ObjectId },
          points: { type: Number, default: 10 },
          description: { type: String },
          questionMarkers: [
            {
              timestamp: { type: Number, required: true },
              questionText: { type: String, required: true },
              questionType: { type: String, enum: ['mcq', 'true-false', 'matching'], default: 'mcq' },
              options: [{ type: String }],
              correctOption: { type: Number, default: 0 },
              matchingPairs: [
                {
                  term: { type: String, required: true },
                  definition: { type: String, required: true }
                }
              ],
              explanation: { type: String, default: '' },
              points: { type: Number, default: 20 }
            }
          ]
        }
      ]
    }
  ],
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
  enrollmentType: { type: String, enum: ['Open', 'Restricted'], default: 'Open' },
  completionRules: {
    minLessonWatchPercent: { type: Number, default: 75 },
    minQuizPassScore: { type: Number, default: 60 },
    requireAllAssignments: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

export default mongoose.model<ICourse>('Course', CourseSchema);
