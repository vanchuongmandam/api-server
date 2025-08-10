const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sanitize = require("sanitize-filename");

// Lấy đường dẫn từ biến môi trường.
const UPLOAD_DIR = process.env.UPLOAD_PATH;

// KIỂM TRA QUAN TRỌNG: Nếu biến môi trường chưa được set, ứng dụng sẽ không khởi động
if (!UPLOAD_DIR) {
  throw new Error("FATAL ERROR: UPLOAD_PATH environment variable is not defined.");
}

// Đảm bảo thư mục upload gốc tồn tại
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const categoryPath = req.body.categoryPath || "";
    const sanitizedParts = categoryPath.split(/[/\\]/).map(part => sanitize(part));
    const safeSubPath = path.join(...sanitizedParts);
    const finalUploadPath = path.join(UPLOAD_DIR, safeSubPath);
    fs.mkdirSync(finalUploadPath, { recursive: true });
    cb(null, finalUploadPath);
  },
  filename: (req, file, cb) => {
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
  cb(new Error("Error: File type not allowed!"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
  fileFilter: fileFilter
});

module.exports = upload;
