import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
export declare const submitAssignment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSubmissionsByAssignment: (req: Request, res: Response) => Promise<void>;
export declare const gradeSubmission: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMySubmissions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getActivityStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=submissionController.d.ts.map