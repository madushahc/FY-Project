import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Student' | 'Lecturer' | 'Admin';
  points: number;
  badges: string[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Lecturer', 'Admin'], default: 'Student' },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
