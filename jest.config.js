
// jest.config.js
module.exports = {
    // Thư mục chứa các file test của bạn
    testMatch: [
        "**/__tests__/**/*.js?(x)",
        "**/?(*.)+(spec|test).js?(x)"
    ],
    // Môi trường test (node là phù hợp cho backend)
    testEnvironment: "node",
    // Tự động clear mock calls và instances giữa các bài test
    clearMocks: true,
    // Đường dẫn tới setup file của Jest (nếu có, để kết nối DB test)
    // setupFilesAfterEnv: ['./jest.setup.js'],
    // Bỏ qua các thư mục này khi tìm file test
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
