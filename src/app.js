/*
 * astronotes server app
 * express app, handles HTTP requests, interfaces with routers
 */

const { NODE_ENV } = require('./config'); // env configs
const express = require('express'); // HTTP server
const morgan = require('morgan'); // HTTP logging
const helmet = require('helmet'); // secure HTTP headers
const logger = require('./logger'); // application logging

const foldersRouter = require('./folders/folders-router');

const notesRouter = require('./notes/notes-router');

// express app
const app = express();

// express middleware
app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', { skip: () => false })
);
app.use(helmet());

// routes
// public static files
app.use(express.static('public'));

app.use('/api/folders', foldersRouter);
app.use('/api/notes', notesRouter);

// default error-handling middleware function
app.use(function errorHandler(error, req, res, next) {
  logger.error(error);
  let response;
  if (NODE_ENV === 'production') {
    response = { error: 'server error' };
  } else {
    response = { error: error.message };
  }
  res.status(500).json(response);
});

module.exports = app;
