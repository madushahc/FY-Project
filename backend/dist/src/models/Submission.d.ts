import mongoose, { Document } from 'mongoose';
export interface ISubmission extends Document {
    assignment: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    fileUrl: string;
    studentNotes?: string;
    submittedAt: Date;
    status: 'Pending Grade' | 'Graded';
    score?: number;
    feedback?: string;
    isLate: boolean;
    rubricGrades?: {
        criteria: string;
        points: number;
        score: number;
    }[];
}
declare const _default: mongoose.Model<ISubmission, {}, {}, {}, mongoose.Document<unknown, {}, ISubmission, {}, mongoose.DefaultSchemaOptions> & ISubmission & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubmission>;
export default _default;
//# sourceMappingURL=Submission.d.ts.map