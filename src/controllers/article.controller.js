
const Article = require("../models/article.model");
const articleService = require("../services/article.service");

// @desc    Create an article
exports.createArticle = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an article
exports.updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// --- Public routes ---

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await articleService.findAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await articleService.findArticleBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArticleSuggestions = async (req, res) => {
  try {
    const { current_slug, categoryId } = req.query;
    // This needs to be updated to work with category IDs now
    const suggestions = await articleService.findSuggestions(current_slug, categoryId);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
