# API Server for vanchuongmamdam

This is the API server for the vanchuongmamdam project. It provides a RESTful API for managing articles, categories, comments, and users.

## Features

*   User authentication with JWT
*   CRUD operations for articles
*   CRUD operations for categories
*   CRUD operations for comments
*   File uploads
*   Article suggestions

## Technologies Used

*   [Node.js](https://nodejs.org/)
*   [Express](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/)
*   [Mongoose](https://mongoosejs.com/)
*   [JWT](https://jwt.io/)
*   [Bcrypt.js](https://www.npmjs.com/package/bcryptjs)
*   [Multer](https://www.npmjs.com/package/multer)
*   [Cors](https://www.npmjs.com/package/cors)
*   [Dotenv](https://www.npmjs.com/package/dotenv)

## Installation and Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/api-server.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add the following environment variables:
    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/vanchuongmamdam
    CORS_ORIGIN=*
    JWT_SECRET=your_super_secret_key
    ```
4.  Start the server:
    ```bash
    npm start
    ```

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

*   `POST /auth/register` - Register a new user
*   `POST /auth/login` - Login a user

### Articles

*   `GET /articles` - Get all articles
*   `GET /articles/:slug` - Get an article by slug
*   `GET /articles/suggestions` - Get article suggestions
*   `POST /articles` - Create a new article
*   `PUT /articles/:slug` - Update an article
*   `DELETE /articles/:slug` - Delete an article

### Categories

*   `GET /categories` - Get all categories
*   `POST /categories` - Create a new category
*   `PUT /categories/:id` - Update a category
*   `DELETE /categories/:id` - Delete a category

### Comments

*   `GET /comments/article/:articleId` - Get all comments for an article
*   `POST /comments` - Create a new comment
*   `PUT /comments/:id` - Update a comment
*   `DELETE /comments/:id` - Delete a comment

### Uploads

*   `POST /upload/single` - Upload a file
*   `POST /upload/multiple` - Upload multi file

## Project Structure

```
.
├── .idx
│   └── dev.nix
├── docker-compose.yml
├── eslint.config.js
├── node_modules
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── seed.js
├── server.js
└── src
    ├── controllers
    │   ├── article.controller.js
    │   ├── auth.controller.js
    │   ├── category.controller.js
    │   └── comment.controller.js
    ├── middleware
    │   ├── auth.middleware.js
    │   └── upload.middleware.js
    ├── models
    │   ├── article.model.js
    │   ├── category.model.js
    │   ├── comment.model.js
    │   └── user.model.js
    ├── routes
    │   ├── article.routes.js
    │   ├── auth.routes.js
    │   ├── category.routes.js
    │   ├── comment.routes.js
    │   └── upload.routes.js
    └── services
        └── article.service.js
```
