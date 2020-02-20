// router for notes endpoint

const express = require('express');
const cors = require('cors');
const path = require('path');

const logger = require('../logger');
const notesService = require('./notes-service');

const notesRouter = express.Router();

notesRouter.use(cors()); // TODO, set cors settings

notesRouter
  .route('/')
  .get((req, res, next) => {
    notesService
      .getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(express.json(), (req, res, next) => {
    const { name, content, folder_id } = req.body;
    // TODO: if (!validateFolderName(name)) return error bad note
    const note = { name, content, folder_id };
    notesService
      .addNote(req.app.get('db'), note)
      .then(([id]) => {
        logger.info('Added note id', id);
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${id}`))
          .json(id);
      })
      .catch(next);
  });

notesRouter
  .route('/:note_id')
  .all(checkNoteExists)
  .get((req, res, next) => {
    notesService
      .getById(req.app.get('db'), req.params.note_id)
      .then(note => {
        res.json(note);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    notesService
      .deleteNote(req.app.get('db'), req.params.note_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(express.json(), (req, res, next) => {
    const { name, content, folder_id } = req.body;
    const note = { name: name, content: content, folder_id: folder_id };
    // TODO VALIDATE NAME
    notesService
      .updateNote(req.app.get('db'), req.params.note_id, note)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

function checkNoteExists(req, res, next) {
  notesService
    .getById(req.app.get('db'), req.params.note_id)
    .then(note => {
      if (!note)
        return res.status(404).json({
          error: `note doesn't exist`
        });
      res.note = note;
      next();
    })
    .catch(error => next(error));
}

module.exports = notesRouter;
