import mongoose, { Document, Schema } from 'mongoose';

export interface IGamificationConfig extends Document {
  lesson: number;
  quiz: number;
  assignment: number;
  forum: number;
}

const gamificationConfigSchema = new Schema({
  lesson: { type: Number, default: 10 },
  quiz: { type: Number, default: 50 },
  assignment: { type: Number, default: 80 },
  forum: { type: Number, default: 5 }
});

export default mongoose.model<IGamificationConfig>('GamificationConfig', gamificationConfigSchema);
