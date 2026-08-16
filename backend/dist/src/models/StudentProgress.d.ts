import mongoose, { Document } from 'mongoose';
export interface IAnsweredQuestion {
    questionMarkerId: string;
    questionText?: string | undefined;
    selectedOption?: number | undefined;
    selectedAnswerText?: string | undefined;
    correctAnswerText?: string | undefined;
    studentResponse?: any;
    activityType?: string | undefined;
    isCorrect: boolean;
    attempts: number;
    timeTaken: number;
    pointsEarned: number;
    answeredAt: Date;
}
export interface IStudentProgress extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    lessonId: string;
    answeredQuestions: IAnsweredQuestion[];
    watchPercent: number;
    maxWatchedTime: number;
    pauseCount: number;
    rewatchCount: number;
    totalPlayDuration: number;
    videoWatched: boolean;
    completed: boolean;
    completedAt?: Date;
    totalPointsEarned: number;
    quizSummary?: {
        totalQuizzesAttempted: number;
        quizCorrectCount: number;
        quizIncorrectCount: number;
        totalQuizTimeTakenSecs: number;
    };
    assignmentSummary?: {
        totalAssignmentsSubmitted: number;
        gradedCount: number;
        totalAssignmentPoints: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: mongoose.Model<IStudentProgress, {}, {}, {}, mongoose.Document<unknown, {}, IStudentProgress, {}, mongoose.DefaultSchemaOptions> & IStudentProgress & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IStudentProgress>;
export default _default;
//# sourceMappingURL=StudentProgress.d.ts.map