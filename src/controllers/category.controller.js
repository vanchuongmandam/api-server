
const Category = require("../models/category.model");
const Article = require("../models/article.model");

// Create a new category
exports.createCategory = async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Name and slug are required fields." });
  }

  try {
    const newCategory = await Category.create({ name, slug });
    res.status(201).json(newCategory);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error creating category:", error.message); 

    if (error.code === 11000) {
      // Find which field was duplicated
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        message: `A category with this ${field} already exists.` 
      });
    }
        
    res.status(500).json({ message: "Server error while creating the category." });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching all categories:", error.message);
    res.status(500).json({ message: "Server error while fetching categories." });
  }
};

// Get all articles in a specific category
exports.getArticlesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const articles = await Article.find({ category: category._id }).populate("category", "name slug");
    res.status(200).json(articles);

  } catch (error) {
    console.error(`Error fetching articles for category "${req.params.slug}":`, error.message);
    res.status(500).json({ message: "Server error while fetching articles." });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const articles = await Article.find({ category: category._id });
    if (articles.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category, it is currently in use by one or more articles." 
      });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Category removed successfully." });

  } catch (error) {
    console.error(`Error deleting category with ID "${req.params.id}":`, error.message);
    res.status(500).json({ message: "Server error while deleting the category." });
  }
};
