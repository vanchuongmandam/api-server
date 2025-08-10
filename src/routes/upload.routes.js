const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sanitize = require("sanitize-filename");
const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");

const UPLOAD_DIR = process.env.UPLOAD_PATH;

if (!UPLOAD_DIR) {
  throw new Error("FATAL ERROR: UPLOAD_PATH environment variable is not defined.");
}

// Middleware để di chuyển file từ thư mục tạm đến thư mục cuối cùng
const moveFileToFinalDestination = (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  const files = req.files || [req.file];
  const categoryPath = req.body.categoryPath || "";
  
  // Vệ sinh (Sanitize) đường dẫn phụ
  const sanitizedParts = categoryPath.split(/[/\\]/).map(part => sanitize(part));
  const safeSubPath = path.join(...sanitizedParts);
  const finalDir = path.join(UPLOAD_DIR, safeSubPath);

  fs.mkdirSync(finalDir, { recursive: true });

  try {
    for (const file of files) {
      const finalPath = path.join(finalDir, file.filename);
      fs.renameSync(file.path, finalPath);
      file.path = finalPath; // Cập nhật lại đường dẫn để hàm sau sử dụng
    }
  } catch (error) {
    console.error("Error moving file:", error);
    return next(new Error("Could not move uploaded file."));
  }
  
  next();
};

const createMediaObject = (req, file) => {
  const relativePath = path.relative(UPLOAD_DIR, file.path);
  const urlPath = relativePath.split(path.sep).join("/");
  const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
  const fileUrl = `${baseUrl}/media/${urlPath}`;
    
  return {
    url: fileUrl,
    mediaType: file.mimetype.startsWith("image") ? "image" : "video"
  };
};

// Áp dụng middleware theo đúng thứ tự: upload -> di chuyển -> xử lý logic
router.post("/single", protect, upload.single("mediaFile"), moveFileToFinalDestination, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file was uploaded or file was moved unsuccessfully." });
  }
  const media = createMediaObject(req, req.file);
  res.status(200).json({ message: "File uploaded successfully.", media });
});

router.post("/multiple", protect, upload.array("mediaFiles", 10), moveFileToFinalDestination, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files were uploaded or files were moved unsuccessfully." });
  }
  const mediaList = req.files.map(file => createMediaObject(req, file));
  res.status(200).json({ message: "Files uploaded successfully.", media: mediaList });
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    // Xóa file tạm nếu có lỗi xảy ra ở bước di chuyển file
    if (req.file) fs.unlinkSync(req.file.path);
    if (req.files) req.files.forEach(f => fs.unlinkSync(f.path));
    return res.status(500).json({ message: err.message });
  }
  next();
});

module.exports = router;
