// router for folders endpoint

const express = require('express');
const cors = require('cors');
const path = require('path');

const logger = require('../logger');
const foldersService = require('./folders-service');

const foldersRouter = express.Router();

foldersRouter.use(cors()); // TODO, set cors settings

foldersRouter
  .route('/')
  .get((req, res, next) => {
    foldersService
      .getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(express.json(), (req, res, next) => {
    let { name } = req.body;
    // TODO: if (!validateFolderName(name)) return error bad folder name
    foldersService
      .addFolder(req.app.get('db'), name)
      .then(id => {
        logger.info('Added folder', { name, id });
        console.log('this is the new folder id', id[0]);
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${id}`))
          .json({ id: id[0] });
      })
      .catch(next);
  });

foldersRouter
  .route('/:folder_id')
  .all(checkFolderExists)
  .get((req, res, next) => {
    foldersService
      .getById(req.app.get('db'), req.params.folder_id)
      .then(folder => {
        res.json(folder);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    console.log(
      'this is the req.params.folder_id and res.folder.id',
      req.params.folder_id
    );
    foldersService
      .deleteFolder(req.app.get('db'), req.params.folder_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(express.json(), (req, res, next) => {
    const { name } = req.body;
    // TODO VALIDATE NAME
    foldersService
      .updateFolder(req.app.get('db'), req.params.folder_id, { name })
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

function checkFolderExists(req, res, next) {
  foldersService
    .getById(req.app.get('db'), req.params.folder_id)
    .then(folder => {
      if (!folder)
        return res.status(404).json({
          error: `Folder doesn't exist`
        });
      res.folder = folder;
      next();
    })
    .catch(error => next(error));
}

module.exports = foldersRouter;
