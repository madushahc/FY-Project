import mongoose, { Document } from 'mongoose';
export interface IQuestion {
    text: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    options?: string[];
    correctAnswer: string;
    hiddenPrompt?: string;
    points: number;
}
export interface IQuiz extends Document {
    course: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    questions: IQuestion[];
    timeLimit?: number;
    passingScore: number;
    isPublished: boolean;
    dueDate?: Date;
    maxAttempts?: number;
    oneAttemptOnly?: boolean;
    attemptsAllowed?: number;
    totalPoints?: number;
    difficultyLevel?: 'Easy' | 'Medium' | 'Hard';
    isFinalQuiz?: boolean;
}
declare const _default: mongoose.Model<IQuiz, {}, {}, {}, mongoose.Document<unknown, {}, IQuiz, {}, mongoose.DefaultSchemaOptions> & IQuiz & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IQuiz>;
export default _default;
//# sourceMappingURL=Quiz.d.ts.map