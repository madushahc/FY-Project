import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
export declare const getPostsByCourse: (req: Request, res: Response) => Promise<void>;
export declare const getAllPosts: (req: Request, res: Response) => Promise<void>;
export declare const createPost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const replyToPost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const likePost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const likeReply: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=forumController.d.ts.map