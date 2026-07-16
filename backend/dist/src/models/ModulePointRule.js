import mongoose, { Schema } from 'mongoose';
const modulePointRuleSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, unique: true },
    lesson: { type: Number, default: 10 },
    quiz: { type: Number, default: 50 },
    assignment: { type: Number, default: 80 },
    forum: { type: Number, default: 5 }
}, {
    timestamps: true
});
export default mongoose.model('ModulePointRule', modulePointRuleSchema);
//# sourceMappingURL=ModulePointRule.js.map