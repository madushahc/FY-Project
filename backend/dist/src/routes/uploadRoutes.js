import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
// @desc    Upload a file (video, document, image)
// @route   POST /api/upload
// @access  Lecturer, Admin
router.post('/', protect, authorize('Lecturer', 'Admin'), upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    // Return the path to access the file
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
        message: 'File uploaded successfully',
        url: fileUrl,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
});
export default router;
//# sourceMappingURL=uploadRoutes.js.map