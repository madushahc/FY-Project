import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
// Load env variables
dotenv.config();
// Connect to database
connectDB();
const app = express();
// Middleware
app.use(express.json());
app.use(cors());
// Basic Route
app.get('/', (req, res) => {
    res.send('EduQuest API is running');
});
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Import Routes
app.use('/api/auth', authRoutes);
import courseRoutes from './routes/courseRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);
// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map