import mongoose, { Schema } from 'mongoose';
const gamificationConfigSchema = new Schema({
    lesson: { type: Number, default: 10 },
    quiz: { type: Number, default: 50 },
    assignment: { type: Number, default: 80 },
    forum: { type: Number, default: 5 }
});
export default mongoose.model('GamificationConfig', gamificationConfigSchema);
