const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = process.env.UPLOAD_PATH;

if (!UPLOAD_DIR) {
  throw new Error("FATAL ERROR: UPLOAD_PATH environment variable is not defined.");
}

// Luôn tạo thư mục gốc nếu nó chưa tồn tại.
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(UPLOAD_DIR, "tmp");
    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, "file-" + uniqueSuffix + extension);
  }
});

// --- FIX: Stricter file filter ---
const fileFilter = (req, file, cb) => {
  // 1. Check file extensions
  const allowedExts = /^\.(jpeg|jpg|png|gif|mp4|mov|avi|webp)$/i;
  const extname = allowedExts.test(path.extname(file.originalname));
  
  // 2. Check MIME types explicitly
  const allowedMimeTypes = /^(image\/(jpeg|png|gif|webp))|(video\/(mp4|quicktime|x-msvideo|avi))$/i;
  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (mimetype && extname) {
    // Allow file
    return cb(null, true);
  }
  
  // Reject file
  const errorMessage = `File type not allowed. Received mimetype: '${file.mimetype}' and extension: '${path.extname(file.originalname)}'`;
  cb(new Error(errorMessage));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
  fileFilter: fileFilter
});

module.exports = upload;
