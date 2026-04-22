import mongoose, { Document, Schema } from 'mongoose';

export interface IForumReply {
  _id?: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface IForumPost extends Document {
  course: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  replies: IForumReply[];
  isPinned: boolean;
}

const ForumPostSchema = new Schema<IForumPost>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  replies: [
    {
      author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      likes: { type: Number, default: 0 }
    }
  ],
  isPinned: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
