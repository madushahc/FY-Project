import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
// Load env variables
dotenv.config();
import { seedDefaultBadges } from './controllers/gamificationController.js';
// Connect to database
connectDB().then(() => {
    seedDefaultBadges();
});
const app = express();
// Middleware
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        // Allow all origins or specify process.env.CLIENT_URL
        callback(null, true);
    },
    credentials: true,
}));
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
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
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
// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
});
const PORT = process.env.PORT || 5000;
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map