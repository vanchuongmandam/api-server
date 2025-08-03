
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./src/models/user.model');
const Category = require('./src/models/category.model');
const Article = require('./src/models/article.model');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const seedDatabase = async () => {
    const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanchuongmamdam';

    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
        console.log('MongoDB connected for seeding...');

        // 1. Clear existing data
        console.log('Clearing old data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Article.deleteMany({});

        // 2. Create Users
        console.log('Creating users...');
        const adminUser = await User.create({
            username: 'admin',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin'
        });
        await User.create({
            username: 'testuser',
            password: 'password123',
            role: 'user'
        });
        console.log('Admin user created with username: admin, password: password123');

        // 3. Create Categories
        console.log('Creating categories...');
        const categoryData = [
            { name: 'Phê bình & Tiểu luận', slug: 'phe-binh-tieu-luan' },
            { name: 'Sáng tác', slug: 'sang-tac' },
            { name: 'Hướng dẫn', slug: 'huong-dan' },
            { name: 'Tản văn', slug: 'tan-van' },
        ];
        const categories = await Category.insertMany(categoryData);
        const categoryMap = categories.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});
        console.log('Categories created.');

        // 4. Create Articles
        console.log('Creating articles...');
        const articleData = [
          {
            slug: 'nghe-thuat-trong-tho-haiku', title: 'Nghệ thuật Tĩnh Lặng trong Thơ Haiku Nhật Bản', author: 'Trần Văn A', date: '15 tháng 7, 2024',
            category: categoryMap['Phê bình & Tiểu luận'], excerpt: 'Khám phá sự tinh tế của thơ Haiku...',
            content: `Thơ Haiku...`, imageUrl: 'https://placehold.co/800x450', trending: true,
          },
          {
            slug: 'chu-nghia-hien-thuc-trong-van-hoc-viet-nam', title: 'Chủ nghĩa Hiện thực trong Văn học Việt Nam 1930-1945', author: 'Nguyễn Thị B', date: '10 tháng 7, 2024',
            category: categoryMap['Phê bình & Tiểu luận'], excerpt: 'Phân tích sâu sắc về dòng văn học hiện thực phê phán...',
            content: 'Giai đoạn 1930-1945...', imageUrl: 'https://placehold.co/600x400', trending: true,
          },
          {
            slug: 'anh-nang-cuoi-vuon', title: 'Ánh Nắng Cuối Vườn', author: 'Lê Cẩm H', date: '05 tháng 7, 2024',
            category: categoryMap['Sáng tác'], excerpt: 'Một truyện ngắn nhẹ nhàng về ký ức tuổi thơ...',
            content: 'Nắng chiều xiên khoai...', imageUrl: 'https://placehold.co/600x400',
          },
        ];
        await Article.insertMany(articleData);
        console.log('Articles created.');

        // 5. Generate a sample token for the admin user
        const payload = { user: { id: adminUser.id, role: adminUser.role } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        
        console.log('\n--- Seeding Complete! ---');
        console.log('You can now test the API.');
        console.log('\n--- Admin Credentials ---');
        console.log('Username: admin');
        console.log('Password: password123');
        console.log('\n--- Example Admin Bearer Token ---');
        console.log(token);
        console.log('\nUse this token in Postman by adding an "Authorization" header with the value "Bearer <token>".');


    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

seedDatabase();
