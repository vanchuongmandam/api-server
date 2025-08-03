
const Category = require('../models/category.model');
const Article = require('../models/article.model');

// Create a new category with improved error handling
exports.createCategory = async (req, res) => {
    const { name, slug } = req.body;

    if (!name || !slug) {
        return res.status(400).json({ message: 'Name and slug are required fields.' });
    }

    try {
        const newCategory = await Category.create({ name, slug });
        res.status(201).json(newCategory);
    } catch (error) {
        // Check for MongoDB duplicate key error (code 11000)
        if (error.code === 11000) {
            // Determine which field was duplicate
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ message: `A category with this ${field} already exists.` }); // 409 Conflict
        }
        // For other potential errors
        res.status(500).json({ message: 'Server error while creating the category.' });
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

        const articles = await Article.find({ category: category._id });
        if (articles.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category, it is currently in use by articles.' });
        }

        // Corrected from .remove() which is deprecated
        await Category.deleteOne({ _id: req.params.id });
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
