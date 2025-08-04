
const Comment = require("../models/comment.model");
const Article = require("../models/article.model");

// --- Controller Actions ---

/**
 * @desc    Create a new comment or a reply
 * @route   POST /api/comments
 * @access  Private (user must be logged in)
 */
exports.createComment = async (req, res) => {
  const { articleId, content, parentCommentId } = req.body;
  const authorId = req.user.id; // From 'protect' middleware

  // 1. Validate input
  if (!articleId || !content) {
    return res.status(400).json({ message: "Article ID and content are required." });
  }

  try {
    // 2. Check if the article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }
        
    // 3. Create and save the new comment
    const newComment = new Comment({
      article: articleId,
      content,
      author: authorId,
      parentComment: parentCommentId || null // Set parent or null
    });

    const savedComment = await newComment.save();

    // 4. Populate author details before sending back
    const populatedComment = await Comment.findById(savedComment._id).populate("author", "username");

    res.status(201).json(populatedComment);

  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error while creating comment." });
  }
};

/**
 * @desc    Get all comments for a single article
 * @route   GET /api/comments/article/:articleId
 * @access  Public
 */
exports.getCommentsByArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
    const comments = await Comment.find({ article: articleId })
      .populate("author", "username") // Populate author's username
      .sort({ createdAt: "asc" }); // Sort by oldest first

    res.status(200).json(comments);
        
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error while fetching comments." });
  }
};

/**
 * @desc    Update a comment
 * @route   PUT /api/comments/:commentId
 * @access  Private (only the comment author)
 */
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "Content is required for update." });
  }

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Check if the current user is the author of the comment
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: You are not the author of this comment." });
    }

    comment.content = content;
    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id).populate("author", "username");

    res.status(200).json(populatedComment);

  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error while updating comment." });
  }
};

/**
 * @desc    Delete a comment (and its replies)
 * @route   DELETE /api/comments/:commentId
 * @access  Private (author or admin)
 */
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const user = req.user; // from 'protect' middleware

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Allow deletion if the user is the author OR is an admin
    if (comment.author.toString() !== user.id && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: You are not authorized to delete this comment." });
    }
        
    // --- Deletion Logic ---
    // We will perform a cascading delete: deleting a parent comment will also delete all its children (replies).
    const commentsToDelete = [commentId];
    const replies = await Comment.find({ parentComment: commentId });
        
    // Simple cascade, can be made more robust for multi-level replies if needed
    replies.forEach(reply => commentsToDelete.push(reply._id));

    await Comment.deleteMany({ _id: { $in: commentsToDelete } });

    res.status(200).json({ message: "Comment and its replies deleted successfully." });

  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error while deleting comment." });
  }
};
