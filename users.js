const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');
const router = new Router({ prefix: '/api/v1/users' });

// GET all users
router.get('/', async (ctx) => {
  const users = await model.getAll();
  ctx.body = users.length ? users : { error: 'No users found' };
});

// GET a single user by ID
router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  const user = await model.getById(id);
  if (user.length) {
    ctx.body = user[0];
  } else {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
  }
});

// POST a new user
router.post('/', bodyParser(), async (ctx) => {
  const user = ctx.request.body;
  const result = await model.add(user);
  if (result) {
    ctx.status = 201;
    ctx.body = { ID: result.insertId };
  } else {
    ctx.status = 500;
    ctx.body = { error: 'Failed to create user' };
  }
});


// PUT (update) a user by ID
router.put('/:id', bodyParser(), async (ctx) => {
  const id = ctx.params.id;
  const updates = ctx.request.body;

  // Validate the provided data
  if (!updates || Object.keys(updates).length === 0) {
    ctx.status = 400;
    ctx.body = { error: 'No updates provided.' };
    return;
  }

  const user = await model.getById(id);
  if (user.length) {
    const result = await model.update(id, updates);
    if (result.affectedRows) {
      ctx.body = { message: 'User updated successfully.' };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Failed to update user.' };
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'User not found.' };
  }
});

// DELETE a user by ID
router.del('/:id', async (ctx) => {
  const id = ctx.params.id;

  // Check if the user exists
  const user = await model.getById(id);
  if (user.length) {
    const result = await model.delete(id);
    if (result.affectedRows) {
      ctx.status = 204; // No Content
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Failed to delete user.' };
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'User not found.' };
  }
});

router.del('/:id', auth, async (ctx) => {
    const id = ctx.params.id;
    const user = await model.getById(id);

    if (user.length) {
        const result = await model.delete(id);
        if (result.affectedRows) {
            ctx.status = 204; // No Content
        } else {
            ctx.status = 500;
            ctx.body = { error: 'Failed to delete user.' };
        }
    } else {
        ctx.status = 404;
        ctx.body = { error: 'User not found.' };
    }
});

module.exports = router;

