
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  }
}, { timestamps: true });

// To prevent creating categories with the same name under the same parent
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
