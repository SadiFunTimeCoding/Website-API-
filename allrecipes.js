const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/allrecipes');
const auth = require('../controllers/auth'); // Import the auth middleware

const router = new Router({ prefix: '/api/v1/allrecipes' });

router.get('/', getAll);
router.get('/:id', getById); // Simplified route
router.put('/:id', auth, bodyParser(), updateRecipe); // Protect PUT
router.post('/', auth, bodyParser(), createRecipe);  // Protect POST
router.del('/:id', auth, deleteRecipe); // Protected route with auth

async function getAll(ctx) {
  const page = parseInt(ctx.query.page) || 1; // Default to page 1
  const limit = parseInt(ctx.query.limit) || 10; // Default to 10 items per page
  const order = ctx.query.order || 'ASC'; // Default to ascending order
  const recipes = await model.getAll(page, limit, order);
  ctx.body = recipes.length ? recipes : { error: 'No recipes found' };
}

async function getById(ctx) {
  const id = ctx.params.id;

  // Fetch the recipe by ID
  const recipe = await model.getById(id);

  if (recipe.length) {
    // Increment views
    await model.incrementViews(id);

    // Respond with the recipe
    ctx.body = recipe[0];
  } else {
    ctx.status = 404;
    ctx.body = { error: "Recipe not found" };
  }
}

async function createRecipe(ctx) {
  const body = ctx.request.body;

  // Validation
  if (!body.title || typeof body.title !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Title is required and must be a string." };
    return;
  }
  if (!body.recipeText || typeof body.recipeText !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Recipe text is required and must be a string." };
    return;
  }
  if (body.imageURL && typeof body.imageURL !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Image URL must be a string." };
    return;
  }
  if (body.published !== undefined && typeof body.published !== "boolean") {
    ctx.status = 400;
    ctx.body = { error: "Published must be a boolean value." };
    return;
  }

  // Add recipe to the database
  let result = await model.add(body);
  if (result) {
    ctx.status = 201;
    ctx.body = { ID: result.insertId };
  } else {
    ctx.status = 500;
    ctx.body = { error: "Failed to create recipe." };
  }
}

async function updateRecipe(ctx) {
  const id = ctx.params.id;
  const updates = ctx.request.body;

  // Validation
  if (updates.title && typeof updates.title !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Title must be a string." };
    return;
  }
  if (updates.recipeText && typeof updates.recipeText !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Recipe text must be a string." };
    return;
  }
  if (updates.imageURL && typeof updates.imageURL !== "string") {
    ctx.status = 400;
    ctx.body = { error: "Image URL must be a string." };
    return;
  }
  if (updates.published !== undefined && typeof updates.published !== "boolean") {
    ctx.status = 400;
    ctx.body = { error: "Published must be a boolean value." };
    return;
  }

  const recipe = await model.getById(id);
  if (recipe.length) {
    const result = await model.update(id, updates);
    if (result.affectedRows) {
      ctx.body = { message: "Recipe updated successfully" };
    } else {
      ctx.status = 500;
      ctx.body = { error: "Failed to update recipe." };
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: "Recipe not found." };
  }
}

async function deleteRecipe(ctx) {
  const id = ctx.params.id;

  if (isNaN(parseInt(id))) {
    ctx.status = 400;
    ctx.body = { error: "Invalid recipe ID." };
    return;
  }

  const recipe = await model.getById(id);
  if (recipe.length) {
    const result = await model.delete(id);
    if (result.affectedRows) {
      ctx.status = 204; // No content
    } else {
      ctx.status = 500;
      ctx.body = { error: "Failed to delete recipe." };
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: "Recipe not found." };
  }
}

module.exports = router;



