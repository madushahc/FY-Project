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
    startedAt?: Date;
    durationSeconds?: number;
    answersSaved: {
        questionId: mongoose.Types.ObjectId;
        studentAnswer: string;
        savedAt: Date;
    }[];
    xpEarned?: number;
    isTimedOut?: boolean;
    status?: string;
    analytics?: {
        attemptNumber?: number;
        totalDurationMs?: number;
        timePerQuestion: {
            questionId: mongoose.Types.ObjectId;
            timeMs: number;
        }[];
    };
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