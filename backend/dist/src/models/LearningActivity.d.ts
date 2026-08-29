import mongoose, { Document } from 'mongoose';
export interface ILearningActivity extends Document {
    student: mongoose.Types.ObjectId;
    course?: mongoose.Types.ObjectId;
    lessonId?: string;
    activityType: string;
    title?: string;
    details?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}
declare const _default: mongoose.Model<ILearningActivity, {}, {}, {}, mongoose.Document<unknown, {}, ILearningActivity, {}, mongoose.DefaultSchemaOptions> & ILearningActivity & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILearningActivity>;
export default _default;
//# sourceMappingURL=LearningActivity.d.ts.map