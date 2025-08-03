
const articleService = require('../services/article.service');

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
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getArticleSuggestions = async (req, res) => {
    try {
        const { current_slug, category } = req.query;
        const suggestions = await articleService.findSuggestions(current_slug, category);
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
