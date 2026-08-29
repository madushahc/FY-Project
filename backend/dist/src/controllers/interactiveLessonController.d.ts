import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
export declare const recordQuestionAnswer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const recordWatchProgress: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLessonProgress: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getInteractiveAnalytics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const exportResearchData: (req: AuthRequest, res: Response) => Promise<void>;
export declare const exportRawEventsData: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=interactiveLessonController.d.ts.map