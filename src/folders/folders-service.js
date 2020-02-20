// DB folder CRUD actions

const foldersService = {};

foldersService.getAllFolders = db => db.select('*').from('folders');

foldersService.getById = (db, id) =>
  db
    .select('*')
    .from('folders')
    .where({ id })
    .first();

foldersService.addFolder = (db, name) =>
  db
    .insert({ name })
    .into('folders')
    .returning('id');

foldersService.updateFolder = (db, id, fields) =>
  db
    .from('folders')
    .where({ id })
    .update(fields);

foldersService.deleteFolder = (db, id) =>
  db
    .from('folders')
    .where({ id })
    .delete();

module.exports = foldersService;
