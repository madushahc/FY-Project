import mongoose, { Document } from 'mongoose';
export interface IGamificationConfig extends Document {
    lesson: number;
    quiz: number;
    assignment: number;
    forum: number;
}
declare const _default: mongoose.Model<IGamificationConfig, {}, {}, {}, mongoose.Document<unknown, {}, IGamificationConfig, {}, mongoose.DefaultSchemaOptions> & IGamificationConfig & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IGamificationConfig>;
export default _default;
//# sourceMappingURL=GamificationConfig.d.ts.map