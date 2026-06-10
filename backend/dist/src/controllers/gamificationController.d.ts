import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare const getBadges: (req: Request, res: Response) => Promise<void>;
export declare const createBadge: (req: AuthRequest, res: Response) => Promise<void>;
export declare const awardPoints: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLeaderboard: (req: Request, res: Response) => Promise<void>;
export declare const getPointRules: (req: Request, res: Response) => Promise<void>;
export declare const updatePointRules: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=gamificationController.d.ts.map