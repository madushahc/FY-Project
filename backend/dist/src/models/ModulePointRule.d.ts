import mongoose, { Document } from 'mongoose';
export interface IModulePointRule extends Document {
    course: mongoose.Types.ObjectId;
    lesson: number;
    quiz: number;
    assignment: number;
    forum: number;
}
declare const _default: mongoose.Model<IModulePointRule, {}, {}, {}, mongoose.Document<unknown, {}, IModulePointRule, {}, mongoose.DefaultSchemaOptions> & IModulePointRule & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IModulePointRule>;
export default _default;
//# sourceMappingURL=ModulePointRule.d.ts.map