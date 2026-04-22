import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string; // Emoji or URL
  category: string;
  triggerEvent: string; // e.g. "Quiz Passed", "Login Streak"
  thresholdValue: number; // e.g. 5
  pointsBonus: number; // e.g. 25
  isVisible: boolean;
  active: boolean; // toggled by lecturer
}

const BadgeSchema = new Schema<IBadge>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, default: 'Achievement' },
  triggerEvent: { type: String, required: true },
  thresholdValue: { type: Number, required: true },
  pointsBonus: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IBadge>('Badge', BadgeSchema);
