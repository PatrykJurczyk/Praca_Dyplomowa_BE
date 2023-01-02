const {
  createHouse,
  editHouse,
  deleteHouse,
  editStatusAccepted,
  editHouseStatusExist,
  getHouses,
  getHouse,
} = require('../controllers/house.controlles');
const { StatusCodes } = require('http-status-codes');
const uploadFilesMiddleware = require('../middlewares/upload');

const houseRoutes = (router) => {
  router.post('/house', uploadFilesMiddleware, async (req, res) => {
    const response = await createHouse(req.body, req.files);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.CREATED).json(response);
  });

  router.patch('/house/:id', uploadFilesMiddleware, async (req, res) => {
    const response = await editHouse(req.body, req.params.id, req.files);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.patch('/house/:id/statusAccepted', async (req, res) => {
    const response = await editStatusAccepted(req.body, req.params.id);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.patch('/house/:id/statusExist', async (req, res) => {
    const response = await editHouseStatusExist(req.body, req.params.id);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.get('/house', async (req, res) => {
    const response = await getHouses();

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.get('/house/:id', async (req, res) => {
    const response = await getHouse(req.params.id);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.delete('/house/:id', async (req, res) => {
    const response = await deleteHouse(req.body, req.params.id);
    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });
};

module.exports = houseRoutes;
