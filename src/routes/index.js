const cookieParser = require('cookie-parser');
const { Router } = require('express');

const userRoutes = require('./user.routes');
const houseRoutes = require('./house.routes');

const router = Router();

router.use(cookieParser());

userRoutes(router);
houseRoutes(router);

module.exports = router;
