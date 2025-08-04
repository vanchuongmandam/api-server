
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

// 1. Use standard express.json() middleware. It must come before the routes.
app.use(express.json());

// 2. Generic Logger - This will now run for every request that gets past express.json()
app.use((req, res, next) => {
    console.log(`--- NEW REQUEST: ${req.method} ${req.originalUrl} ---`);
    next();
});

// 3. Routes
const authRoutes = require('./src/routes/auth.routes');
const articleRoutes = require('./src/routes/article.routes');
const categoryRoutes = require('./src/routes/category.routes');

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);

// 4. Custom Error-Handling Middleware
// This middleware has 4 arguments, which Express recognizes as an error handler.
// It will catch errors from express.json() parsing, and any `next(error)` calls.
app.use((err, req, res, next) => {
  // Check if the error is a syntax error thrown by express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('--- JSON PARSING ERROR ---');
    console.error('Error Message:', err.message);
    // The 'body' property contains the raw, unparsed body string.
    // Be careful logging this in production as it might contain sensitive data.
    console.error('Raw Request Body:', (err).body); 
    console.error('--------------------------');
    return res.status(400).json({ 
      message: 'Bad Request: The request body is not valid JSON.' 
    });
  }
  
  // For any other errors, pass them on to the default Express handler
  next(err);
});


// 5. Database connection and Server start
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanchuongmamdam';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
    .catch((err) => console.log(err));

module.exports = app;
