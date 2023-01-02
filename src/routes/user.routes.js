const { StatusCodes } = require('http-status-codes');
const {
  createUser,
  deleteUser,
  restoreUser,
  editPassword,
  editUser,
  loginUser,
  toggleFavorites,
  getUser,
  getUsers,
} = require('../controllers/user.controllers');
const uploadFilesMiddleware = require('../middlewares/upload');

const userRoutes = (router) => {
  router.post('/users', async (req, res) => {
    const response = await createUser(req.body);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.CREATED).json(response);
  });

  router.post('/login', async (req, res) => {
    const response = await loginUser(req.body);
    res.cookie('auth', response.token, { maxAge: process.env.MAX_AGE, httpOnly: true });

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.post('/logout', (req, res) => {
    res.clearCookie('auth');
    return res.status(StatusCodes.OK).json({ message: 'Wylogowano.' });
  });

  router.patch('/users/:id', uploadFilesMiddleware, async (req, res) => {
    const response = await editUser(req.body, req.params.id, req.files);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.patch('/users/:id/password', async (req, res) => {
    const response = await editPassword(req.body, req.params.id);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.patch('/users/:id/deletion', async (req, res) => {
    const response = await deleteUser(req.params.id);
    res.clearCookie('auth');

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.patch('/users/:id/restore', async (req, res) => {
    const response = await restoreUser(req.params.id);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.patch('/users/:id/favorite', async (req, res) => {
    const response = await toggleFavorites(req.body, req.params.id);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.get('/users', async (req, res) => {
    const response = await getUsers();

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.get('/users/:id', async (req, res) => {
    const response = await getUser(req.params.id);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });
};

module.exports = userRoutes;
