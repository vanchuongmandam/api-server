
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
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// IMPORTANT: Custom error handler for JSON parsing errors
app.use(express.json({
    onerror: (err, req, res, next) => {
        console.error('--- JSON PARSING ERROR ---');
        console.error('Error:', err.message);
        console.error('Request Body:', req.body); // The raw (and likely malformed) body
        console.error('--------------------------');
        res.status(400).json({ message: 'Bad Request: The request body is not valid JSON.' });
    }
}));


// GENERIC LOGGER
app.use((req, res, next) => {
    console.log(`--- NEW REQUEST: ${req.method} ${req.originalUrl} ---`);
    next();
});

// Routes
const authRoutes = require('./src/routes/auth.routes');
const articleRoutes = require('./src/routes/article.routes');
const categoryRoutes = require('./src/routes/category.routes');

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);


// Database connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanchuongmamdam';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
    .catch((err) => console.log(err));

module.exports = app;
