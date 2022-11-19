const compression = require('compression');
const express = require('express');
const helmet = require('helmet');

const env = require('./constants/env');
const routes = require('./routes');

const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
  })
);
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());
// app.use('/static', express.static('src/uploads/images'));
app.use('/src/uploads/images', express.static('src/uploads/images'));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// serving client files in production
if (env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}
// upload folder for house images
app.use('/uploads', express.static('src/uploads'));

// gzip compression
app.use(compression());

// api routes
app.use('/api', routes);

module.exports = app;
