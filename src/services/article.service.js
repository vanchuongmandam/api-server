
const Article = require('../models/article.model');

exports.findAllArticles = async () => {
    // Exclude 'content' for performance
    return await Article.find().select('-content');
};

exports.findArticleBySlug = async (slug) => {
    return await Article.findOne({ slug: slug });
};

exports.findSuggestions = async (currentSlug, category) => {
    return await Article.find({
        slug: { $ne: currentSlug }, // $ne means "not equal"
        category: category
    }).limit(3).select('-content');
};
