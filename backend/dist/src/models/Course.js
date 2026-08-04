import mongoose, { Schema } from 'mongoose';
const CourseSchema = new Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
    department: { type: String },
    description: { type: String, required: true },
    creditHours: { type: Number },
    academicYear: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    maxEnrollment: { type: Number },
    difficultyLevel: { type: String },
    thumbnailUrl: { type: String },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modules: [
        {
            title: { type: String, required: true },
            lessons: [
                {
                    title: { type: String, required: true },
                    type: { type: String, enum: ['video', 'quiz', 'assignment', 'reading', 'link'], required: true },
                    contentUrl: { type: String },
                    duration: { type: Number },
                    refId: { type: Schema.Types.ObjectId },
                    points: { type: Number, default: 10 },
                    description: { type: String },
                    qrMarkers: [
                        {
                            timestamp: { type: Number, required: true },
                            code: { type: String, required: true },
                            label: { type: String, default: 'Scan QR Code' },
                            points: { type: Number, default: 15 }
                        }
                    ],
                    questionMarkers: [
                        {
                            timestamp: { type: Number, required: true },
                            questionText: { type: String, required: true },
                            questionType: { type: String, enum: ['mcq', 'true-false', 'matching'], default: 'mcq' },
                            options: [{ type: String }],
                            correctOption: { type: Number, default: 0 },
                            matchingPairs: [
                                {
                                    term: { type: String, required: true },
                                    definition: { type: String, required: true }
                                }
                            ],
                            explanation: { type: String, default: '' },
                            points: { type: Number, default: 20 }
                        }
                    ]
                }
            ]
        }
    ],
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
    enrollmentType: { type: String, enum: ['Open', 'Restricted'], default: 'Open' },
    completionRules: {
        minLessonWatchPercent: { type: Number, default: 75 },
        minQuizPassScore: { type: Number, default: 60 },
        requireAllAssignments: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});
export default mongoose.model('Course', CourseSchema);
//# sourceMappingURL=Course.js.map