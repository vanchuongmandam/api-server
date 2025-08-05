  
# API Server Cho Dự Án Văn Chương Mắm Đậm

Đây là backend API server được xây dựng bằng Node.js, Express, và MongoDB. Server cung cấp đầy đủ các chức năng xác thực, quản lý bài viết, danh mục, bình luận và upload media.

## ✨ Tính Năng Nổi Bật

- **Xác thực & Phân quyền:** Sử dụng JWT (JSON Web Tokens) để xác thực. Phân quyền rõ ràng giữa người dùng thường (`user`) và quản trị viên (`admin`).
- **Quản lý Bài viết & Danh mục (CRUD):** Tạo, đọc, cập nhật, xóa bài viết và danh mục.
- **Hệ thống Bình luận & Trả lời:** Người dùng có thể bình luận về bài viết và trả lời các bình luận khác (hỗ trợ nested comments).
- **Upload Media:** Cho phép upload file ảnh và video. File được lưu trữ trực tiếp trên server và phục vụ qua Nginx để tối ưu hiệu suất.
- **API Documentation:** Tài liệu API chi tiết và dễ sử dụng.
- **Cấu hình linh hoạt:** Cho phép tùy chỉnh cổng (`PORT`) và CORS origin qua file `.env`.

## 🚀 Cài Đặt & Khởi Chạy

### 1. Clone a Repository
```sh
git clone <your-repository-url>
cd <repository-name>
```

### 2. Cài đặt các Gói Phụ Thuộc
```sh
npm install
```

### 3. Tạo file Biến Môi Trường (`.env`)
Tạo một file mới tên là `.env` ở thư mục gốc của dự án và điền các thông tin sau.

```ini
# (Tùy chọn) Cổng mà server sẽ chạy. Mặc định là 3000.
PORT=5000

# Kết nối tới MongoDB
MONGODB_URI=mongodb://localhost:27017/vanchuongmamdam

# Khóa bí mật để tạo JWT, hãy thay bằng một chuỗi ngẫu nhiên và dài
JWT_SECRET=your_super_secret_key_should_be_long_and_random

# URL công khai của server, dùng để tạo link file media khi deploy
PUBLIC_URL=http://your_domain_or_vps_ip

# (QUAN TRỌNG) URL của frontend được phép truy cập API.
# Trong production, hãy đặt là domain của frontend (ví dụ: https://my-app.com).
# Mặc định là '*' (cho phép tất cả).
CORS_ORIGIN=http://localhost:3000
```

### 4. Tạo Dữ Liệu Mẫu (Tùy chọn)
```sh
node seed.js
```

### 5. Khởi chạy Server
- **Chế độ Development:**
  ```sh
  npm run dev
  ```
- **Chế độ Production:**
  ```sh
  npm start
  ```
Server sẽ chạy trên cổng được định nghĩa trong file `.env` hoặc cổng 3000.

---
... (phần còn lại của README.md không thay đổi) ...
