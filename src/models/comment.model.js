
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    // Reference to the article this comment belongs to
    article: { 
        type: Schema.Types.ObjectId, 
        ref: 'Article', 
        required: true,
        index: true // Indexing for faster queries
    },
    // Reference to the user who wrote the comment
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // The actual content of the comment
    content: { 
        type: String, 
        required: [true, 'Comment content cannot be empty.'], 
        trim: true 
    },
    // The parent-child reference for replies
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null // null indicates a top-level comment
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Comment', commentSchema);
