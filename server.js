
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
};
app.use(cors(corsOptions));

app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth.routes');
const articleRoutes = require('./src/routes/article.routes');
const categoryRoutes = require('./src/routes/category.routes');

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);

// Custom Error-Handling Middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // In a production environment, you might not want to log the error message
    // or at least not the request body, as it could contain sensitive information.
    console.error('JSON Parsing Error:', err.message);
    return res.status(400).json({ message: 'Bad Request: The request body is not valid JSON.' });
  }
  next(err);
});


// Database connection and Server start
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanchuongmamdam';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        app.listen(port, () => {
            // This is a useful log to keep, to know the server has started successfully.
            console.log(`Server running on port: ${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

module.exports = app;
