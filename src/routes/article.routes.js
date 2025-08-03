
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');

// GET /api/articles - Get all articles
router.get('/', articleController.getAllArticles);

// GET /api/articles/:slug - Get a single article by slug
router.get('/:slug', articleController.getArticleBySlug);

// GET /api/articles/suggestions - Get article suggestions
router.get('/suggestions', articleController.getArticleSuggestions);

module.exports = router;
