/**
 * EduQuest Research Analytics Central Configuration Module
 * 
 * Defines standard parameters, formulas, weights, threshold guardrails,
 * and canonical event names for empirical participant engagement tracking.
 */

export const RESEARCH_CONFIG = {
  // Study Parameters
  RESEARCH_INTERVENTION_DAYS: 14, // Expected study duration (days)
  MEANINGFUL_INTERACTION_REFERENCE: 20, // Expected interaction benchmark count

  // Formula Component Weights
  WEIGHTS: {
    V: 0.40, // Video Watch Score weight (40%)
    Q: 0.30, // Assessment Participation Score weight (30%)
    L: 0.20, // Lesson Completion Score weight (20%)
    S: 0.10  // System Interaction Score weight (10%)
  },

  // Threshold Guardrails
  VIDEO_COMPLETION_THRESHOLD: 75, // Min watch % to mark video/lesson completed

  // At-Risk Rule Thresholds
  AT_RISK: {
    E_THRESHOLD: 50, // Composite engagement score < 50%
    V_THRESHOLD: 40, // Video watch score < 40%
    Q_THRESHOLD: 30  // Assessment participation score < 30%
  },

  // Canonical Telemetry Event Constants
  EVENTS: {
    LOGIN: 'login',
    LESSON_ACCESS: 'lesson_access',
    VIDEO_PLAY: 'video_play',
    VIDEO_PAUSE: 'video_pause',
    VIDEO_REWATCH: 'video_rewatch',
    VIDEO_PROGRESS: 'video_progress',
    CHECKPOINT_ANSWERED: 'checkpoint_answered',
    QUIZ_STARTED: 'quiz_started',
    QUIZ_SUBMITTED: 'quiz_submitted',
    QUIZ_TIMED_OUT: 'quiz_timed_out',
    LESSON_COMPLETED: 'lesson_completed',
    POINTS_AWARDED: 'points_awarded',
    BADGE_AWARDED: 'badge_awarded',
    LEADERBOARD_VIEWED: 'leaderboard_viewed'
  },

  // Telemetry Event Types classified as "Meaningful Behavioral User Events" (Excludes reward events)
  MEANINGFUL_EVENTS: [
    'login',
    'lesson_access',
    'video_play',
    'video_pause',
    'video_rewatch',
    'video_progress',
    'checkpoint_answered',
    'quiz_started',
    'quiz_submitted',
    'quiz_timed_out',
    'lesson_completed',
    'leaderboard_viewed'
  ]
};

export default RESEARCH_CONFIG;
