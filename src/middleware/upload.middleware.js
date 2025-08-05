
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the absolute path for uploads
// It's safer to use an absolute path that is outside of the project directory.
const uploadDir = "/var/www/media";

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  console.log(`Upload directory ${uploadDir} does not exist. Please create it manually with appropriate permissions.`);
  // In a real production setup, you should ensure this directory is created during deployment.
  // For local development, we can create it.
  if (process.env.NODE_ENV !== "production") {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created development upload directory at ${uploadDir}`);
    } catch (error) {
      console.error("Failed to create development directory:", error);
    }
  }
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwriting files
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter for allowed file types (images and videos)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|mp4|mov|avi/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: File type not allowed. Only images and videos are supported."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    // Set a file size limit (e.g., 100MB for videos)
    fileSize: 100 * 1024 * 1024 
  },
  fileFilter: fileFilter
});

module.exports = upload;
