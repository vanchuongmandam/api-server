
const Article = require("../models/article.model");

exports.findAllArticles = async () => {
  // Populate the 'category' field to include name and slug
  return await Article.find().populate("category", "name slug").select("-content");
};

exports.findArticleBySlug = async (slug) => {
  // Also populate category details for a single article
  return await Article.findOne({ slug: slug }).populate("category", "name slug");
};

exports.findSuggestions = async (currentSlug, categoryId) => {
  // Find suggestions based on the category ID
  // Exclude the current article using its slug
  return await Article.find({
    slug: { $ne: currentSlug },
    category: categoryId 
  }).limit(3).select("-content").populate("category", "name slug");
};
