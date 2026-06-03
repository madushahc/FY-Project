import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare const getCourses: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCourseById: (req: Request, res: Response) => Promise<void>;
export declare const createCourse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCourse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCourse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLecturerStudents: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=courseController.d.ts.map