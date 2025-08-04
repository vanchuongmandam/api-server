
const globals = require("globals");
const google = require("eslint-config-google");

module.exports = [
  {
    files: ["**/*.js"], // Áp dụng cho tất cả các file .js
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    // Mở rộng từ cấu hình Google
    extends: [google],
    rules: {
      // Tùy chỉnh các quy tắc nếu cần
      // Ví dụ: Bỏ qua lỗi yêu cầu JSDoc cho hàm/biến
      "valid-jsdoc": "off",
      // Cho phép console.log và console.error trong dev (trong production nên loại bỏ)
      "no-console": "off", 
      // Cảnh báo thay vì lỗi cho biến không sử dụng, bỏ qua args
      "no-unused-vars": ["warn", { "args": "none" }], 
      // Tắt rule yêu cầu tên hàm phải có chữ hoa đầu tiên (thích hợp cho React Component)
      "new-cap": "off"
    }
  }
];
