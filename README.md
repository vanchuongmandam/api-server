# **API document**

## **1. Quản lý Người dùng (Authentication)**

### **1.1. Đăng ký tài khoản mới**

Tạo một tài khoản người dùng mới.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
      "username": "ten_nguoi_dung",
      "password": "mat_khau_cua_ban",
      "role": "user" // Tùy chọn, có thể là "user" hoặc "admin". Mặc định là "user".
  }
  ```

### **1.2. Đăng nhập**

Xác thực người dùng và nhận về một JSON Web Token (JWT).

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Access:** Public
- **Body:**
  ```json
  {
      "username": "ten_nguoi_dung",
      "password": "mat_khau_cua_ban"
  }
  ```

---

## **2. Quản lý Danh mục (Categories)**

### **2.1. Thêm danh mục mới**

Thêm một danh mục bài viết mới vào hệ thống.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/categories`
- **Access:** Private (Yêu cầu quyền Admin)
- **Authorization:** `Bearer <admin_token>`
- **Body:**
  ```json
  {
      "name": "Tên Danh Mục",
      "slug": "ten-danh-muc"
  }
  ```

### **2.2. Lấy tất cả danh mục**

Lấy danh sách tất cả các danh mục.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/categories`
- **Access:** Public

### **2.3. Lấy bài viết theo danh mục**

Lấy danh sách bài viết thuộc một danh mục cụ thể dựa trên slug.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/categories/:slug/articles`
- **Access:** Public
- **Ví dụ URL:** `http://localhost:5000/api/categories/phe-binh-tieu-luan/articles`

### **2.4. Xóa danh mục**

Xóa một danh mục khỏi hệ thống dựa trên ID.

- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/categories/:id`
- **Access:** Private (Yêu cầu quyền Admin)
- **Authorization:** `Bearer <admin_token>`
- **Ví dụ URL:** `http://localhost:5000/api/categories/669a4c8bbf390a7d9f83b4e1`

---

## **3. Quản lý Bài viết (Articles)**

### **3.1. Thêm bài viết mới**

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/articles`
- **Access:** Private (Yêu cầu quyền Admin)
- **Authorization:** `Bearer <admin_token>`
- **Body:**
  ```json
  {
      "slug": "slug-bai-viet-moi",
      "title": "Tiêu đề bài viết mới",
      "author": "Tên tác giả",
      "date": "Ngày đăng",
      "category": "ID_cua_category",
      "excerpt": "Đoạn tóm tắt ngắn",
      "content": "Nội dung đầy đủ của bài viết...",
      "imageUrl": "https://example.com/image.jpg",
      "trending": false
  }
  ```

### **3.2. Lấy tất cả bài viết**

Lấy danh sách tất cả bài viết (không bao gồm nội dung chi tiết).

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/articles`
- **Access:** Public

### **3.3. Lấy chi tiết bài viết**

Lấy thông tin chi tiết của một bài viết dựa trên slug.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/articles/:slug`
- **Access:** Public
- **Ví dụ URL:** `http://localhost:5000/api/articles/chiec-la-cuoi-cung-tren-pho`

### **3.4. Cập nhật bài viết**

Cập nhật thông tin cho một bài viết đã có.

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/articles/:slug`
- **Access:** Private (Yêu cầu quyền Admin)
- **Authorization:** `Bearer <admin_token>`
- **Body:** (Gửi các trường bạn muốn cập nhật)
  ```json
  {
      "title": "Tiêu đề bài viết đã được cập nhật",
      "content": "Nội dung mới..."
  }
  ```

### **3.5. Xóa bài viết**

Xóa một bài viết khỏi hệ thống dựa trên slug.

- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/articles/:slug`
- **Access:** Private (Yêu cầu quyền Admin)
- **Authorization:** `Bearer <admin_token>`

---

## **4. Quản lý Bình luận (Comments)**

### **4.1. Thêm bình luận hoặc trả lời**

Thêm một bình luận mới vào bài viết, hoặc trả lời một bình luận đã có.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/comments`
- **Access:** Private (Yêu cầu người dùng đăng nhập)
- **Authorization:** `Bearer <user_token>`
- **Body (để tạo bình luận gốc):**
  ```json
  {
      "articleId": "ID_cua_bai_viet",
      "content": "Đây là một bình luận rất hay!"
  }
  ```
- **Body (để trả lời một bình luận khác):**
  ```json
  {
      "articleId": "ID_cua_bai_viet",
      "content": "Tôi đồng ý với bạn!",
      "parentCommentId": "ID_cua_binh_luan_cha"
  }
  ```

### **4.2. Lấy bình luận của bài viết**

Lấy danh sách tất cả bình luận và trả lời của một bài viết cụ thể.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/comments/article/:articleId`
- **Access:** Public
- **Ví dụ URL:** `http://localhost:5000/api/comments/article/669b8d2c1f0e4d6c7a8b4567`

### **4.3. Chỉnh sửa bình luận**

Chỉnh sửa nội dung một bình luận mà bạn là tác giả.

- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/comments/:commentId`
- **Access:** Private (Chỉ tác giả của bình luận)
- **Authorization:** `Bearer <user_token>`
- **Body:**
  ```json
  {
      "content": "Nội dung bình luận đã được chỉnh sửa."
  }
  ```

### **4.4. Xóa bình luận**

Xóa một bình luận. Nếu là admin, có thể xóa mọi bình luận. Nếu là người dùng, chỉ có thể xóa bình luận của chính mình.

- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/comments/:commentId`
- **Access:** Private (Tác giả hoặc Admin)
- **Authorization:** `Bearer <user_or_admin_token>`
