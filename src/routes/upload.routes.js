const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");

// Lấy đường dẫn gốc từ biến môi trường để tính toán đường dẫn tương đối
const UPLOAD_DIR = process.env.UPLOAD_PATH;
if (!UPLOAD_DIR) {
  throw new Error("FATAL ERROR: UPLOAD_PATH environment variable is not defined.");
}

// Hàm trợ giúp để tạo media object từ file
const createMediaObject = (req, file) => {
  // 1. Lấy đường dẫn tuyệt đối của file đã lưu: /var/www/media/cat1/cat2/file-123.jpg
  const absolutePath = file.path;

  // 2. Tính toán đường dẫn tương đối so với thư mục media gốc
  // -> cat1/cat2/file-123.jpg
  const relativePath = path.relative(UPLOAD_DIR, absolutePath);

  // 3. Chuẩn hóa để dùng trong URL (thay \\ thành / cho Windows)
  const urlPath = relativePath.split(path.sep).join("/");

  // 4. Tạo URL công khai
  const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
  const fileUrl = `${baseUrl}/media/${urlPath}`;

  return {
    url: fileUrl,
    mediaType: file.mimetype.startsWith("image") ? "image" : "video"
  };
};


// @route   POST /api/upload/single
// @desc    Upload a single media file with an optional categoryPath
// @access  Private
router.post("/single", protect, upload.single("mediaFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file was uploaded." });
  }

  const media = createMediaObject(req, req.file);

  res.status(200).json({
    message: "File uploaded successfully.",
    media: media
  });
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple media files with an optional categoryPath
// @access  Private
router.post("/multiple", protect, upload.array("mediaFiles", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const mediaList = req.files.map(file => createMediaObject(req, file));

  res.status(200).json({
    message: "Files uploaded successfully.",
    media: mediaList
  });
});

// Middleware xử lý lỗi từ Multer để response có định dạng JSON đẹp hơn
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});


module.exports = router;
