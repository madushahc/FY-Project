import mongoose, { Schema } from 'mongoose';
const NotificationSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['system', 'assignment', 'grade', 'badge', 'forum'], default: 'system' },
    linkUrl: { type: String },
    isRead: { type: Boolean, default: false },
    urgency: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' }
}, {
    timestamps: true
});
export default mongoose.model('Notification', NotificationSchema);
//# sourceMappingURL=Notification.js.map