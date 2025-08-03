
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// @route   POST api/articles
// @desc    Create an article
// @access  Private/Admin
router.post('/', protect, isAdmin, articleController.createArticle);

// @route   GET api/articles
// @desc    Get all articles
// @access  Public
router.get('/', articleController.getAllArticles);

// @route   GET api/articles/:slug
// @desc    Get a single article by slug
// @access  Public
router.get('/:slug', articleController.getArticleBySlug);

// @route   PUT api/articles/:slug
// @desc    Update an article
// @access  Private/Admin
router.put('/:slug', protect, isAdmin, articleController.updateArticle);

// @route   DELETE api/articles/:slug
// @desc    Delete an article
// @access  Private/Admin
router.delete('/:slug', protect, isAdmin, articleController.deleteArticle);


// Note: The suggestions route can be improved, but for now we keep it simple
router.get('/suggestions', articleController.getArticleSuggestions);


module.exports = router;
