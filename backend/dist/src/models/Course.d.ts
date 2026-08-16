import mongoose, { Document } from 'mongoose';
export interface IMatchingPair {
    term: string;
    definition: string;
}
export interface IQuestionMarker {
    _id?: mongoose.Types.ObjectId;
    timestamp: number;
    questionText: string;
    questionType?: 'mcq' | 'true-false' | 'matching' | 'feedback';
    options: string[];
    correctOption: number;
    matchingPairs?: IMatchingPair[];
    explanation?: string;
    hiddenPrompt?: string;
    points?: number;
}
export interface ILesson {
    _id?: mongoose.Types.ObjectId;
    title: string;
    type: 'video' | 'quiz' | 'assignment' | 'reading' | 'link';
    contentUrl?: string;
    duration?: number;
    refId?: mongoose.Types.ObjectId;
    points?: number;
    description?: string;
    questionMarkers?: IQuestionMarker[];
}
export interface IModule {
    _id?: mongoose.Types.ObjectId;
    title: string;
    lessons: ILesson[];
}
export interface ICourse extends Document {
    title: string;
    code: string;
    department?: string;
    description: string;
    creditHours?: number;
    academicYear?: string;
    startDate?: Date;
    endDate?: Date;
    maxEnrollment?: number;
    difficultyLevel?: string;
    thumbnailUrl?: string;
    instructor: mongoose.Types.ObjectId;
    modules: IModule[];
    category: string;
    status: 'Published' | 'Draft';
    enrollmentType: 'Open' | 'Restricted';
    completionRules?: {
        minLessonWatchPercent: number;
        minQuizPassScore: number;
        requireAllAssignments: boolean;
    };
}
declare const _default: mongoose.Model<ICourse, {}, {}, {}, mongoose.Document<unknown, {}, ICourse, {}, mongoose.DefaultSchemaOptions> & ICourse & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICourse>;
export default _default;
//# sourceMappingURL=Course.d.ts.map