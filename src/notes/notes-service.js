// DB folder Crud

const notesService = {};

notesService.getAllNotes = db => db.select('*').from('notes');

notesService.getById = (db, id) =>
  db
    .select('*')
    .from('notes')
    .where({ id })
    .first();

notesService.addNote = (db, note) =>
  db
    .insert(note)
    .into('notes')
    .returning('id');

notesService.updateNote = (db, id, fields) =>
  db
    .from('notes')
    .where({ id })
    .update(fields);

notesService.deleteNote = (db, id) =>
  db
    .from('notes')
    .where({ id })
    .delete();

module.exports = notesService;
