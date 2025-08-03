
const Category = require('../models/category.model');
const Article = require('../models/article.model');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const category = new Category({ name, slug });
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all articles in a specific category
exports.getArticlesByCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const articles = await Article.find({ category: category._id }).populate('category', 'name slug');
        res.status(200).json(articles);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Optional: Check if any articles are using this category before deleting
        const articles = await Article.find({ category: category._id });
        if (articles.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category, it is currently in use by articles.' });
        }

        await category.remove();
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
