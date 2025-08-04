
const mongoose = require('mongoose');

// Schema phụ cho mỗi file media, có thể tái sử dụng
const mediaFileSchema = new mongoose.Schema({
    // URL công khai trỏ đến file, được cung cấp bởi dịch vụ lưu trữ hoặc VPS của bạn
    url: { type: String, required: true },
    
    // Loại file để giúp frontend biết cách render (hiển thị <img /> hay <video />)
    mediaType: { 
        type: String, 
        required: true, 
        enum: ['image', 'video'] 
    },
    
    // (Tùy chọn) Một chú thích ngắn cho file media, dùng làm alt-text hoặc caption
    caption: { type: String, trim: true }
}, { 
    _id: false // Không tạo ObjectId riêng cho mỗi sub-document này
});

// Schema chính cho Article
const articleSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true }, 
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true
    },
    excerpt: { type: String },
    content: { type: String, required: true },
    
    // ĐÃ SỬA: Thay thế 'imageUrl' bằng một mảng các đối tượng media
    media: [mediaFileSchema], 
    
    trending: { type: Boolean, default: false }
}, { 
    timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Article', articleSchema);
