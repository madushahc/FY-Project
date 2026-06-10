import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare const createAssignment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAssignmentsByCourse: (req: Request, res: Response) => Promise<void>;
export declare const submitAssignment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const gradeSubmission: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=assignmentController.d.ts.map