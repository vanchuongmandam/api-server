
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");

// @route   POST /api/upload
// @desc    Upload a single media file (image or video)
// @access  Private
router.post("/", protect, (req, res) => {
  const uploader = upload.single("mediaFile");

  uploader(req, res, function (err) {
    if (err) {
      console.error("Upload Error:", err.message);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded." });
    }

    // --- URL CONSTRUCTION (IMPROVED FOR PRODUCTION) ---
    // Use an environment variable for the base URL in production for reliability.
    // Fallback to dynamic host for development.
    const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/media/${req.file.filename}`;

    res.status(200).json({
      message: "File uploaded successfully.",
      url: fileUrl,
      filename: req.file.filename,
      mediaType: req.file.mimetype.startsWith("image") ? "image" : "video"
    });
  });
});

module.exports = router;
