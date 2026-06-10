import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
export declare const enrollInCourse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMyEnrollments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProgress: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=enrollmentController.d.ts.map