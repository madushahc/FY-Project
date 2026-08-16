import mongoose, { Document } from 'mongoose';
export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'system' | 'assignment' | 'grade' | 'badge' | 'forum' | 'enroll' | 'course' | 'award' | 'points';
    linkUrl?: string;
    isRead: boolean;
    urgency: 'low' | 'normal' | 'high';
}
declare const _default: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, mongoose.DefaultSchemaOptions> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INotification>;
export default _default;
//# sourceMappingURL=Notification.d.ts.map