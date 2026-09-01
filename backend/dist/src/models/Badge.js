import mongoose, { Schema } from 'mongoose';
const BadgeSchema = new Schema({
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
export default mongoose.model('Badge', BadgeSchema);
