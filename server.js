
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/media", express.static(process.env.UPLOAD_PATH));

// --- Routes ---
const authRoutes = require("./src/routes/auth.routes");
const articleRoutes = require("./src/routes/article.routes");
const categoryRoutes = require("./src/routes/category.routes");
const commentRoutes = require("./src/routes/comment.routes");
const uploadRoutes = require("./src/routes/upload.routes");

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);

// --- Error Handling ---
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON Parsing Error:", err.message);
    return res.status(400).json({ message: "Bad Request: The request body is not valid JSON." });
  }
  next(err);
});

// --- Database & Server Start ---
const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/vanchuongmamdam";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {
    app.listen(port, () => {
      console.log("Connect MongoDB Successfully");
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

module.exports = app;
