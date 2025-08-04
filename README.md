
# API Server Cho Dự Án Văn Chương Mắm Đậm

Đây là backend API server được xây dựng bằng Node.js, Express, và MongoDB. Server cung cấp đầy đủ các chức năng xác thực, quản lý bài viết, danh mục, bình luận và upload media.

## ✨ Tính Năng Nổi Bật

- **Xác thực & Phân quyền:** Sử dụng JWT (JSON Web Tokens) để xác thực. Phân quyền rõ ràng giữa người dùng thường (`user`) và quản trị viên (`admin`).
- **Quản lý Bài viết & Danh mục (CRUD):** Tạo, đọc, cập nhật, xóa bài viết và danh mục.
- **Hệ thống Bình luận & Trả lời:** Người dùng có thể bình luận về bài viết và trả lời các bình luận khác (hỗ trợ nested comments).
- **Upload Media:** Cho phép upload file ảnh và video. File được lưu trữ trực tiếp trên server và phục vụ qua Nginx để tối ưu hiệu suất.
- **API Documentation:** Tài liệu API chi tiết và dễ sử dụng.

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
Tạo một file mới tên là `.env` ở thư mục gốc của dự án và điền các thông tin sau. Đây là file cực kỳ quan trọng để server hoạt động.

```ini
# Kết nối tới MongoDB
MONGODB_URI=mongodb://localhost:27017/vanchuongmamdam

# Khóa bí mật để tạo JWT, hãy thay bằng một chuỗi ngẫu nhiên và dài
JWT_SECRET=your_super_secret_key_should_be_long_and_random

# URL công khai của server, dùng để tạo link file media khi deploy
# Khi chạy ở local, có thể bỏ trống hoặc để là http://localhost:5000
PUBLIC_URL=http://your_domain_or_vps_ip
```

### 4. Tạo Dữ Liệu Mẫu (Tùy chọn)
Chạy lệnh sau để xóa dữ liệu cũ và thêm vào các tài khoản, danh mục, và bài viết mẫu để test.
```sh
node seed.js
```
Lệnh này sẽ tạo một tài khoản admin (`username: admin`, `password: password123`) và cung cấp cho bạn một token mẫu.

### 5. Khởi chạy Server
- **Chế độ Development (tự động restart khi có thay đổi):**
  ```sh
  npm run dev
  ```
- **Chế độ Production:**
  ```sh
  npm start
  ```
Server sẽ chạy tại `http://localhost:5000`.

---

## 📖 Tài Liệu API

### **1. Authentication (`/api/auth`)**

#### **1.1. Đăng ký**
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Body:**
  ```json
  {
      "username": "testuser",
      "password": "password123",
      "role": "user"
  }
  ```

#### **1.2. Đăng nhập**
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Body:**
  ```json
  {
      "username": "admin",
      "password": "password123"
  }
  ```
- **Success Response (UPDATED):**
  ```json
  {
    "token": "your_jwt_token_string",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "username": "admin",
      "role": "admin"
    }
  }
  ```

---

### **2. Media Upload (`/api/upload`) (NEW)**
Hệ thống hoạt động theo 2 bước:
1.  Upload file lên server để nhận về URL.
2.  Dùng URL nhận được để tạo/cập nhật bài viết.

#### **2.1. Upload một file media**
- **Method:** `POST`
- **URL:** `/api/upload`
- **Access:** `Private` (Yêu cầu đăng nhập)
- **Authorization:** `Bearer <user_token>`
- **Body:** Phải là dạng `multipart/form-data` với một trường (field) tên là `mediaFile` chứa file của bạn.
- **Success Response:**
  ```json
  {
    "message": "File uploaded successfully.",
    "url": "http://localhost:5000/media/mediaFile-1678886400000-123456789.jpg",
    "filename": "mediaFile-1678886400000-123456789.jpg",
    "mediaType": "image"
  }
  ```

---

### **3. Articles (`/api/articles`)**

#### **3.1. Tạo bài viết mới (UPDATED)**
- **Method:** `POST`
- **URL:** `/api/articles`
- **Access:** `Private` (Admin)
- **Authorization:** `Bearer <admin_token>`
- **Body:**
  ```json
  {
      "slug": "bai-viet-moi-voi-hinh-anh",
      "title": "Bài Viết Mới Với Hình Ảnh",
      "author": "Tác Giả A",
      "date": "20 tháng 7, 2024",
      "category": "669a4c8bbf390a7d9f83b4e1",
      "excerpt": "Đây là một bài viết có chứa cả ảnh và video.",
      "content": "Nội dung chi tiết của bài viết...",
      "media": [
          {
              "url": "http://localhost:5000/media/image-file.jpg",
              "mediaType": "image",
              "caption": "Ảnh minh họa cho bài viết"
          },
          {
              "url": "http://localhost:5000/media/video-file.mp4",
              "mediaType": "video",
              "caption": "Video giới thiệu"
          }
      ]
  }
  ```

_Các endpoint khác của Articles (GET, PUT, DELETE) không thay đổi về cấu trúc nhưng giờ đây sẽ trả về mảng `media` thay vì `imageUrl`._

---

### **4. Comments (`/api/comments`) (NEW)**

#### **4.1. Tạo bình luận hoặc trả lời**
- **Method:** `POST`
- **URL:** `/api/comments`
- **Access:** `Private`
- **Authorization:** `Bearer <user_token>`
- **Body (Bình luận gốc):**
  ```json
  {
      "articleId": "id_cua_bai_viet",
      "content": "Đây là một bình luận rất hay!"
  }
  ```
- **Body (Trả lời bình luận khác):**
  ```json
  {
      "articleId": "id_cua_bai_viet",
      "content": "Tôi đồng ý với bạn!",
      "parentCommentId": "id_cua_binh_luan_cha"
  }
  ```

#### **4.2. Lấy tất cả bình luận của một bài viết**
- **Method:** `GET`
- **URL:** `/api/comments/article/:articleId`
- **Access:** `Public`

#### **4.3. Cập nhật & Xóa bình luận**
- **Update:** `PUT /api/comments/:commentId` (Chỉ tác giả)
- **Delete:** `DELETE /api/comments/:commentId` (Tác giả hoặc Admin)

---

### **5. Categories (`/api/categories`)**
_(Các endpoint của Categories không có thay đổi lớn)_

- **Create:** `POST /api/categories` (Admin)
- **Get All:** `GET /api/categories`
- **Get Articles:** `GET /api/categories/:slug/articles`
- **Delete:** `DELETE /api/categories/:id` (Admin)

---

## 🔧 Triển Khai Lên Production (Deployment)

Để deploy lên VPS Ubuntu, bạn nên sử dụng **Nginx** làm reverse proxy và **PM2** để quản lý tiến trình Node.js.
1.  Cài đặt Nginx và cấu hình nó để phục vụ file tĩnh từ `/var/www/media` và chuyển tiếp các request API tới backend.
2.  Cài đặt PM2 (`npm install pm2 -g`).
3.  Chạy ứng dụng bằng `pm2 start server.js --name "api-server"`.
4.  Lưu lại tiến trình để nó tự khởi động lại khi reboot: `pm2 save`.
