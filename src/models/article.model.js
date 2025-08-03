
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
