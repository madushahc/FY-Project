import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
export declare const createQuiz: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCourseQuizzes: (req: Request, res: Response) => Promise<void>;
export declare const getQuizById: (req: Request, res: Response) => Promise<void>;
export declare const startQuizAttempt: (req: AuthRequest, res: Response) => Promise<void>;
export declare const autoSaveAnswer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMyQuizAttempts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const submitQuizAttempt: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getQuizStats: (req: Request, res: Response) => Promise<void>;
export declare const getAssignedFinalQuiz: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=quizController.d.ts.map