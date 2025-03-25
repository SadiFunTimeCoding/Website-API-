const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

// Import route modules
const specialRoutes = require('./routes/special'); // Match your file name casing
const allRecipesRoutes = require('./routes/allrecipes'); // Replace 'articles' with 'allrecipes'
const usersRoutes = require('./routes/users'); // Ensure the path matches your 'users.js'

// Middleware
app.use(bodyParser()); // Apply bodyParser globally

// Routes
app.use(specialRoutes.routes()).use(specialRoutes.allowedMethods());
app.use(allRecipesRoutes.routes()).use(allRecipesRoutes.allowedMethods());
app.use(usersRoutes.routes()).use(usersRoutes.allowedMethods()); // Ensure consistency with allowedMethods

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

