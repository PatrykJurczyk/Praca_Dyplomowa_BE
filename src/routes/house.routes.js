const { createHouse, editHouse, deleteHouse } = require('../controllers/house.controlles');
const { StatusCodes } = require('http-status-codes');
const House = require('../models/house');

const houseRoutes = (router) => {
  router.post('/house', async (req, res) => {
    const response = await createHouse(req.body);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.CREATED).json(response);
  });

  router.patch('/house/:id', async (req, res) => {
    const response = await editHouse(req.body, req.params.id);

    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });

  router.get('/house', async (req, res) => {
    try {
      const house = await House.find();
      res.status(200).json(house);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.get('/house/:id', async (req, res) => {
    try {
      const house = await House.findOne({ _id: req.params.id });
      res.status(200).json(house);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.delete('/house/:id', async (req, res) => {
    const response = await deleteHouse(req.params.id);
    if (response.status === 'invalid') {
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  });
};

module.exports = houseRoutes;
