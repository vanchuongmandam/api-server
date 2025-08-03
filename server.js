
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const articleRoutes = require('./src/routes/article.routes');
app.use('/api/articles', articleRoutes);

// Database connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanchuongmamdam';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
    .catch((err) => console.log(err));

module.exports = app;
