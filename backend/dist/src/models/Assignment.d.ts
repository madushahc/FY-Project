import mongoose, { Document } from 'mongoose';
export interface IAssignment extends Document {
    course: mongoose.Types.ObjectId;
    title: string;
    instructions: string;
    points: number;
    deadline: Date;
    latePenaltyPercent: number;
    submissionType: string;
    referenceMaterials: string[];
    rubric: {
        criteria: string;
        points: number;
    }[];
    isPublished: boolean;
}
declare const _default: mongoose.Model<IAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IAssignment, {}, mongoose.DefaultSchemaOptions> & IAssignment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAssignment>;
export default _default;
//# sourceMappingURL=Assignment.d.ts.map