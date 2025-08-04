
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');

// @route   POST /api/upload
// @desc    Upload a single media file (image or video)
// @access  Private
router.post('/', protect, (req, res) => {
    // 'upload.single('mediaFile')' will process one file attached to the form field named 'mediaFile'.
    const uploader = upload.single('mediaFile');

    uploader(req, res, function (err) {
        if (err) {
            // Handle Multer errors (e.g., file size limit, wrong file type)
            console.error('Upload Error:', err.message);
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file was uploaded.' });
        }

        // IMPORTANT: Construct the public URL
        // This URL must match the one served by Nginx later.
        // Replace 'your_vps_ip_or_domain' with your actual server IP or domain name.
        const fileUrl = `${req.protocol}://${req.get('host')}/media/${req.file.filename}`;

        res.status(200).json({
            message: 'File uploaded successfully.',
            url: fileUrl,
            filename: req.file.filename,
            mediaType: req.file.mimetype.startsWith('image') ? 'image' : 'video'
        });
    });
});

module.exports = router;
