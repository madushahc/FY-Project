import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'system' | 'assignment' | 'grade' | 'badge' | 'forum' | 'enroll' | 'course' | 'award' | 'points';
  linkUrl?: string; // route to navigate to on click
  isRead: boolean;
  urgency: 'low' | 'normal' | 'high';
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['system', 'assignment', 'grade', 'badge', 'forum', 'enroll', 'course', 'award', 'points'], default: 'system' },
  linkUrl: { type: String },
  isRead: { type: Boolean, default: false },
  urgency: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' }
}, {
  timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
