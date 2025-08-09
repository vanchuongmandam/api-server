
const Category = require("../models/category.model");
const Article = require("../models/article.model");
const mongoose = require("mongoose");

/**
 * Helper function to build a nested category tree from a flat list of categories.
 * @param {Array} categories - Flat list of category documents from MongoDB.
 * @returns {Array} - A nested list of category objects.
 */
const buildCategoryTree = (categories) => {
  const categoryMap = {};
  const tree = [];

  // First, map all categories by their ID
  categories.forEach(category => {
    categoryMap[category._id] = { ...category.toObject(), children: [] };
  });

  // Then, build the tree structure
  categories.forEach(category => {
    if (category.parent) {
      if (categoryMap[category.parent]) {
        categoryMap[category.parent].children.push(categoryMap[category._id]);
      }
    } else {
      tree.push(categoryMap[category._id]);
    }
  });

  return tree;
};

/**
 * Helper function to get all descendant category IDs for a given parent.
 * @param {string} parentId - The ID of the parent category.
 * @param {Array} allCategories - A flat list of all categories.
 * @returns {Array} - A list of descendant category IDs.
 */
const getDescendantCategoryIds = (parentId, allCategories) => {
  const children = allCategories.filter(cat => cat.parent && cat.parent.equals(parentId));
  let descendantIds = [];
  for (const child of children) {
    descendantIds.push(child._id);
    descendantIds = descendantIds.concat(getDescendantCategoryIds(child._id, allCategories));
  }
  return descendantIds;
};


// Create a new category (parent or child)
exports.createCategory = async (req, res) => {
  const { name, slug, parentId } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Name and slug are required fields." });
  }

  try {
    const categoryData = { name, slug };
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ message: "Invalid parent ID format." });
      }
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found." });
      }
      categoryData.parent = parentId;
    }

    const newCategory = await Category.create(categoryData);
    res.status(201).json(newCategory);

  } catch (error) {
    console.error("Error creating category:", error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern).join(", ");
      if (field.includes("name") && field.includes("parent")) {
        return res.status(409).json({
          message: `A category with the name "${name}" already exists under this parent.`
        });
      }
      return res.status(409).json({
        message: `A category with this ${field} already exists.`
      });
    }
    res.status(500).json({ message: "Server error while creating the category." });
  }
};

// Get all categories as a nested tree
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const categoryTree = buildCategoryTree(categories);
    res.status(200).json(categoryTree);
  } catch (error) {
    console.error("Error fetching all categories:", error.message);
    res.status(500).json({ message: "Server error while fetching categories." });
  }
};


// Get all articles in a specific category, including its descendants
exports.getArticlesByCategory = async (req, res) => {
  try {
    const parentCategory = await Category.findOne({ slug: req.params.slug });
    if (!parentCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Get all categories to find descendants
    const allCategories = await Category.find();
    
    // Find all descendant category IDs
    const descendantIds = getDescendantCategoryIds(parentCategory._id, allCategories);
    
    // The list of categories to search for includes the parent and all its descendants
    const categoryIdsToSearch = [parentCategory._id, ...descendantIds];

    const articles = await Article.find({ category: { $in: categoryIdsToSearch } })
      .populate("category", "name slug");
      
    res.status(200).json(articles);

  } catch (error)
  {
    console.error(`Error fetching articles for category "${req.params.slug}":`, error.message);
    res.status(500).json({ message: "Server error while fetching articles." });
  }
};


// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID format." });
  }

  try {
    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete) {
      return res.status(404).json({ message: "Category not found." });
    }

    const childCount = await Category.countDocuments({ parent: id });
    if (childCount > 0) {
      return res.status(400).json({
        message: "Cannot delete category because it has child categories. Please delete or reassign them first."
      });
    }

    const articleCount = await Article.countDocuments({ category: id });
    if (articleCount > 0) {
      return res.status(400).json({
        message: "Cannot delete category, it is currently in use by one or more articles."
      });
    }

    await Category.deleteOne({ _id: id });
    res.status(200).json({ message: "Category removed successfully." });

  } catch (error) {
    console.error(`Error deleting category with ID "${id}":`, error.message);
    res.status(500).json({ message: "Server error while deleting the category." });
  }
};
