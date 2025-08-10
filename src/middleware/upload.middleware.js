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
    // Luôn lưu file vào một thư mục tạm thời trước.
    // Điều này giải quyết vấn đề req.body chưa sẵn sàng.
    const tempDir = path.join(UPLOAD_DIR, 'tmp');
    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file độc nhất để tránh trùng lặp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, "file-" + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("File type not allowed!"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
  fileFilter: fileFilter
});

module.exports = upload;
