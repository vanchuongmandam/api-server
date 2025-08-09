# API Server Cho Dự Án Văn Chương Mắm Đậm

Đây là backend API server được xây dựng bằng Node.js, Express, và MongoDB. Server cung cấp đầy đủ các chức năng xác thực, quản lý bài viết, danh mục đa cấp, bình luận và upload media.

## ✨ Tính Năng Nổi Bật

- **Xác thực & Phân quyền:** Sử dụng JWT (JSON Web Tokens). Phân quyền rõ ràng giữa người dùng thường (`user`) và quản trị viên (`admin`).
- **Quản lý Bài viết (CRUD):** Tạo, đọc, cập nhật, xóa bài viết.
- **Hệ thống Danh mục Đa Cấp (NEW):** Hỗ trợ tạo danh mục cha-con không giới hạn, cho phép tổ chức bài viết một cách khoa học và có cấu trúc.
- **Hệ thống Bình luận & Trả lời:** Người dùng có thể bình luận về bài viết và trả lời các bình luận khác.
- **Upload Media:** Cho phép upload file.
- **Cấu hình linh hoạt:** Tùy chỉnh các thông số quan trọng qua file `.env`.

## 🚀 Cài Đặt & Khởi Chạy

### 1. Clone Repository
```sh
git clone <your-repository-url>
cd <repository-name>
```

### 2. Cài đặt các Gói Phụ Thuộc
```sh
npm install
```

### 3. Tạo file Biến Môi Trường (`.env`)
Tạo một file mới tên là `.env` ở thư mục gốc và sao chép nội dung từ file `.env.example` (nếu có) hoặc tự điền các thông tin sau:

```ini
# Cổng mà server sẽ chạy (mặc định: 3000)
PORT=5000

# Chuỗi kết nối tới MongoDB
MONGODB_URI=mongodb://localhost:27017/vanchuongmamdam

# Khóa bí mật để tạo JWT (thay bằng một chuỗi ngẫu nhiên và dài)
JWT_SECRET=your_super_secret_key_should_be_long_and_random

# (QUAN TRỌNG) URL của frontend được phép truy cập API
CORS_ORIGIN=http://localhost:3000
```

### 4. Khởi chạy Server
- **Chế độ Development (với hot-reload):**
  ```sh
  npm run dev
  ```
- **Chế độ Production:**
  ```sh
  npm start
  ```
Server sẽ chạy trên cổng được định nghĩa trong file `.env` hoặc cổng 3000.

---

## 📖 Tài Liệu API

### **1. Authentication (`/api/auth`)**
- **`POST /api/auth/register`**: Đăng ký người dùng mới.
- **`POST /api/auth/login`**: Đăng nhập và nhận về `token` cùng thông tin `user`.

---

### **2. Categories (`/api/categories`) (UPDATED)**

Hệ thống danh mục giờ đây hỗ trợ cấu trúc cây.

#### **2.1. Lấy tất cả danh mục (dạng cây)**
- **Method:** `GET`
- **URL:** `/api/categories`
- **Access:** `Public`
- **Success Response:**
  Trả về một mảng các danh mục gốc. Mỗi danh mục có thể chứa một mảng `children` là các danh mục con.
  ```json
  [
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Phê bình & Tiểu luận",
      "slug": "phe-binh-tieu-luan",
      "parent": null,
      "children": [
        {
          "_id": "60d0fe4f5311236168a109cb",
          "name": "Phê bình Thơ Mới",
          "slug": "phe-binh-tho-moi",
          "parent": "60d0fe4f5311236168a109ca",
          "children": []
        }
      ]
    },
    {
      "_id": "60d0fe4f5311236168a109cc",
      "name": "Sáng tác",
      "slug": "sang-tac",
      "parent": null,
      "children": []
    }
  ]
  ```

#### **2.2. Tạo danh mục mới**
- **Method:** `POST`
- **URL:** `/api/categories`
- **Access:** `Private` (Admin)
- **Authorization:** `Bearer <admin_token>`
- **Body (Tạo danh mục gốc):**
  ```json
  {
      "name": "Sáng tác",
      "slug": "sang-tac"
  }
  ```
- **Body (Tạo danh mục con):**
  Thêm `parentId` là `_id` của danh mục cha.
  ```json
  {
      "name": "Tản văn",
      "slug": "tan-van",
      "parentId": "60d0fe4f5311236168a109cc"
  }
  ```

#### **2.3. Lấy bài viết theo danh mục (bao gồm cả danh mục con)**
- **Method:** `GET`
- **URL:** `/api/categories/:slug/articles`
- **Access:** `Public`
- **Description:** Lấy tất cả bài viết thuộc danh mục có `slug` được chỉ định và tất cả các bài viết thuộc danh mục con của nó.

#### **2.4. Xóa danh mục**
- **Method:** `DELETE`
- **URL:** `/api/categories/:id`
- **Access:** `Private` (Admin)
- **Description:** Chỉ có thể xóa danh mục nếu nó **không có danh mục con** và **không có bài viết nào** đang sử dụng.

---

### **3. Articles (`/api/articles`)**

#### **3.1. Tạo/Cập nhật bài viết**
- **`POST /api/articles`** (Tạo mới)
- **`PUT /api/articles/:id`** (Cập nhật)
- **Access:** `Private` (Admin)
- **Description:** Khi tạo hoặc cập nhật một bài viết, trường `category` phải là `_id` của một danh mục cụ thể (thường là một danh mục con, không phải danh mục gốc).
- **Body:**
  ```json
  {
      "slug": "bai-viet-moi",
      "title": "Bài Viết Mới",
      "author": "Tác Giả A",
      "category": "60d0fe4f5311236168a109cb", // ID của danh mục "Phê bình Thơ Mới"
      "excerpt": "Tóm tắt bài viết...",
      "content": "Nội dung chi tiết của bài viết..."
  }
  ```
_Các endpoint khác của Articles (GET, DELETE) không thay đổi._

---

### **4. Comments (`/api/comments`)**
- **`POST /api/comments`**: Tạo bình luận mới hoặc trả lời bình luận (`parentCommentId`).
- **`GET /api/comments/article/:articleId`**: Lấy tất cả bình luận (dạng lồng nhau) của một bài viết.
- **`PUT /api/comments/:commentId`**: Cập nhật bình luận (chỉ tác giả).
- **`DELETE /api/comments/:commentId`**: Xóa bình luận (tác giả hoặc admin).

---
### **5. Media Upload (`/api/upload`)**
- **`POST /api/upload`**: Tải một file media lên và nhận về URL.
- **Access:** `Private` (Yêu cầu đăng nhập).
- **Body:** Dạng `multipart/form-data` với một trường tên là `mediaFile`.
