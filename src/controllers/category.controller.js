
const Category = require('../models/category.model');
const Article = require('../models/article.model');

// Create a new category with improved error handling and logging
exports.createCategory = async (req, res) => {
    console.log('--- ENTERING CREATE CATEGORY CONTROLLER ---');
    console.log('[Controller] Request Body:', req.body);

    const { name, slug } = req.body;

    if (!name || !slug) {
        console.error('[Controller] Error: Name or slug is missing.');
        return res.status(400).json({ message: 'Name and slug are required fields.' });
    }

    try {
        const newCategory = await Category.create({ name, slug });
        console.log('[Controller] Category created successfully:', newCategory);
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('[Controller] Database error:', error.message);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ message: `A category with this ${field} already exists.` });
        }
        res.status(500).json({ message: 'Server error while creating the category.' });
    }
};

// ... (rest of the controller remains the same)

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

        await Category.deleteOne({ _id: req.params.id });
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
