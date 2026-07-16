import mongoose, { Document } from 'mongoose';
export interface IQuizAttempt extends Document {
    quiz: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    score: number;
    earnedPoints: number;
    answers: {
        questionId: mongoose.Types.ObjectId;
        studentAnswer: string;
        isCorrect: boolean;
    }[];
    passed: boolean;
    attemptedAt: Date;
}
declare const _default: mongoose.Model<IQuizAttempt, {}, {}, {}, mongoose.Document<unknown, {}, IQuizAttempt, {}, mongoose.DefaultSchemaOptions> & IQuizAttempt & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IQuizAttempt>;
export default _default;
//# sourceMappingURL=QuizAttempt.d.ts.map