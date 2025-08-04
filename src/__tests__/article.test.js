
const request = require('supertest');
const app = require('../../server'); // Đường dẫn tới file Express app của bạn
const mongoose = require('mongoose');

// Môi trường test database URI
const DB_TEST_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanchuongmamdam_test';

// Kết nối database trước khi chạy tất cả các test
beforeAll(async () => {
  await mongoose.connect(DB_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  // Xóa dữ liệu cũ hoặc seed dữ liệu test nếu cần
  // await mongoose.connection.db.dropDatabase();
});

// Đóng kết nối database sau khi tất cả các test đã chạy xong
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Article API', () => {
  // Test GET /api/articles
  it('should return all articles', async () => {
    const res = await request(app).get('/api/articles');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Test GET /api/articles/:slug (chưa có dữ liệu, sẽ fail nếu không seed)
  it('should return 404 for a non-existent article slug', async () => {
    const res = await request(app).get('/api/articles/non-existent-slug');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Article not found');
  });
});
