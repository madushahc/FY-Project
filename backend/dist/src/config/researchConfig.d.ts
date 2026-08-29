/**
 * EduQuest Research Analytics Central Configuration Module
 *
 * Defines standard parameters, formulas, weights, threshold guardrails,
 * and canonical event names for empirical participant engagement tracking.
 */
export declare const RESEARCH_CONFIG: {
    RESEARCH_INTERVENTION_DAYS: number;
    MEANINGFUL_INTERACTION_REFERENCE: number;
    WEIGHTS: {
        V: number;
        Q: number;
        L: number;
        S: number;
    };
    VIDEO_COMPLETION_THRESHOLD: number;
    AT_RISK: {
        E_THRESHOLD: number;
        V_THRESHOLD: number;
        Q_THRESHOLD: number;
    };
    EVENTS: {
        LOGIN: string;
        LESSON_ACCESS: string;
        VIDEO_PLAY: string;
        VIDEO_PAUSE: string;
        VIDEO_REWATCH: string;
        VIDEO_PROGRESS: string;
        CHECKPOINT_ANSWERED: string;
        QUIZ_STARTED: string;
        QUIZ_SUBMITTED: string;
        QUIZ_TIMED_OUT: string;
        LESSON_COMPLETED: string;
        POINTS_AWARDED: string;
        BADGE_AWARDED: string;
        LEADERBOARD_VIEWED: string;
    };
    MEANINGFUL_EVENTS: string[];
};
export default RESEARCH_CONFIG;
//# sourceMappingURL=researchConfig.d.ts.map