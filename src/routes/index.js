const cookieParser = require('cookie-parser');
const { Router } = require('express');

const userRoutes = require('./user.routes');

const router = Router();

router.use(cookieParser());

userRoutes(router);

module.exports = router;
