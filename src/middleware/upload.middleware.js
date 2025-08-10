const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sanitize = require("sanitize-filename");

// Lấy đường dẫn từ biến môi trường. Đây là cách làm đúng đắn nhất.
const UPLOAD_DIR = process.env.UPLOAD_PATH;

// KIỂM TRA QUAN TRỌNG: Nếu biến môi trường chưa được set, ứng dụng sẽ không khởi động
if (!UPLOAD_DIR) {
  throw new Error("FATAL ERROR: UPLOAD_PATH environment variable is not defined.");
}

// Đảm bảo thư mục upload gốc tồn tại
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lấy đường dẫn phụ tùy chọn từ body request
    const categoryPath = req.body.categoryPath || "";

    // Vệ sinh (Sanitize) đường dẫn phụ để chống tấn công Path Traversal
    const sanitizedParts = categoryPath.split(/[/\\]/).map(part => sanitize(part));
    const safeSubPath = path.join(...sanitizedParts);
    
    // Ghép đường dẫn gốc từ .env và đường dẫn phụ đã được làm sạch
    const finalUploadPath = path.join(UPLOAD_DIR, safeSubPath);

    // Tạo cấu trúc thư mục nếu chưa tồn tại
    fs.mkdirSync(finalUploadPath, { recursive: true });
    
    cb(null, finalUploadPath);
  },
  filename: (req, file, cb) => {
    // Tạo tên file độc nhất
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + extension);
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
