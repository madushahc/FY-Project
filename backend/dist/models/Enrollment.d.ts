import mongoose, { Document } from 'mongoose';
export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    progress: number;
    completedLessons: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IEnrollment, {}, {}, {}, mongoose.Document<unknown, {}, IEnrollment, {}, mongoose.DefaultSchemaOptions> & IEnrollment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEnrollment>;
export default _default;
//# sourceMappingURL=Enrollment.d.ts.map