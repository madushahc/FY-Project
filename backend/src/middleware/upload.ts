import multer from 'multer';
import path from 'path';

// Configure storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Requires 'uploads' folder to exist
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter (optional, e.g., to only allow PDFs/Images)
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept basically any standard file for course contents/assignments
  cb(null, true);
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});
