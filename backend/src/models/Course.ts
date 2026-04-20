import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  title: string;
  content: string; // text or video URL
  duration: number; // in minutes
}

export interface IModule {
  title: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  modules: IModule[];
  category: string;
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  modules: [
    {
      title: { type: String, required: true },
      lessons: [
        {
          title: { type: String, required: true },
          content: { type: String, required: true },
          duration: { type: Number, required: true },
        }
      ]
    }
  ],
  category: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ICourse>('Course', CourseSchema);
