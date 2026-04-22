import mongoose, { Document } from 'mongoose';
export interface IBadge extends Document {
    name: string;
    description: string;
    icon: string;
    category: string;
    triggerEvent: string;
    thresholdValue: number;
    pointsBonus: number;
    isVisible: boolean;
    active: boolean;
}
declare const _default: mongoose.Model<IBadge, {}, {}, {}, mongoose.Document<unknown, {}, IBadge, {}, mongoose.DefaultSchemaOptions> & IBadge & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBadge>;
export default _default;
//# sourceMappingURL=Badge.d.ts.map