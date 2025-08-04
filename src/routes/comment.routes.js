
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// --- Comment Routes ---

// @route   POST api/comments
// @desc    Create a new comment or reply
// @access  Private (any logged-in user)
router.post('/', protect, commentController.createComment);

// @route   GET api/comments/article/:articleId
// @desc    Get all comments for a specific article
// @access  Public
router.get('/article/:articleId', commentController.getCommentsByArticle);

// @route   PUT api/comments/:commentId
// @desc    Update a user's own comment
// @access  Private (must be the author)
router.put('/:commentId', protect, commentController.updateComment);

// @route   DELETE api/comments/:commentId
// @desc    Delete a comment
// @access  Private (author or an admin)
router.delete('/:commentId', protect, commentController.deleteComment);

module.exports = router;
