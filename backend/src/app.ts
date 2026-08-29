import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedDefaultBadges } from './controllers/gamificationController.js';

dotenv.config();

// Connect DB asynchronously
let isDbConnected = false;
export const ensureDbConnected = async () => {
  if (!isDbConnected) {
    await connectDB();
    await seedDefaultBadges();
    isDbConnected = true;
  }
};

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// DB Connection Middleware for Serverless execution
app.use(async (req, res, next) => {
  try {
    await ensureDbConnected();
    next();
  } catch (err) {
    console.error("Database connection error in middleware:", err);
    res.status(500).json({ message: "Database Connection Failed", error: (err as any).message });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('EduQuest API is running');
});

// Import Routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

export default app;
