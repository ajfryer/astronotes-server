/*
 * astronotes server app
 * express app, handles HTTP requests, interfaces with routers
 */

const { NODE_ENV } = require('./config'); // env configs
const express = require('express'); // HTTP server
const morgan = require('morgan'); // HTTP logging
const cors = require('cors');
const helmet = require('helmet'); // secure HTTP headers
const logger = require('./logger'); // application logging

const foldersRouter = require('./folders/folders-router');
const foldersService = require('./folders/folders-service'); // business logic folders service

const notesRouter = require('./notes/notes-router');
const notesService = require('./notes/notes-service');

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

/*app.get('/api/folders', (req, res, next) => {
  const knexInstance = req.app.get('db');
  foldersService
    .getAllFolders(knexInstance)
    .then(folders => {
      res.json(folders);
    })
    .catch(next);
});*/

/*app.get('/api/folders/:folder_id', (req, res, next) => {
  const knexInstance = req.app.get('db');
  foldersService
    .getById(knexInstance, req.params.folder_id)
    .then(folder => {
      res.json(folder);
    })
    .catch(next);
});*/

// api endpoints
//app.use('/api/folders', foldersRouter);
//app.use('/api/notes', notesRouter);

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
