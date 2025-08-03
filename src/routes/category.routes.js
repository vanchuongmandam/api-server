
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// @route   POST api/categories
// @desc    Create a new category
// @access  Private/Admin
router.post('/', protect, isAdmin, categoryController.createCategory);

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

// @route   GET api/categories/:slug/articles
// @desc    Get all articles for a specific category by slug
// @access  Public
router.get('/:slug/articles', categoryController.getArticlesByCategory);

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, categoryController.deleteCategory);

module.exports = router;
