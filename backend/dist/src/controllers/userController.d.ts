import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map