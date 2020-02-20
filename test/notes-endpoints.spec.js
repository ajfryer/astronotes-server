const knex = require('knex');
require('dotenv').config();
const Postgrator = require('postgrator');

const app = require('../src/app');

describe('notes endpoint', () => {
  let db;

  // test fixtures
  const testFolders = [
    { id: 1, name: 'Test Folder 1' },
    { id: 2, name: 'Test Folder 2' }
  ];

  const testNotes = [
    {
      id: 1,
      name: 'Test Note 1',
      content: 'Test Note 1 Content',
      folder_id: 1,
      date_created: '2020-02-17T07:39:05.649Z',
      date_modified: '2020-02-17T07:39:05.649Z'
    },
    {
      id: 2,
      name: 'Test Note 2',
      content: 'Test Note 2 Content',
      folder_id: 2,
      date_created: '2020-02-17T07:39:05.649Z',
      date_modified: '2020-02-17T07:39:05.649Z'
    }
  ];

  // setup SQL migration scripts
  const postgrator = new Postgrator({
    migrationDirectory: 'migrations',
    driver: 'pg',
    connectionString: process.env.TEST_DATABASE_URL
  });

  // before all tests: initialize test db
  before(async () => {
    await postgrator.migrate('000');

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });

    app.set('db', db);
  });

  // after all tests: teardown db
  after(() => {
    db.destroy();
    postgrator.migrate('000');
  });

  context('Given there are no notes in the test db', () => {
    beforeEach(async () => {
      await postgrator.migrate('002');
      await db
        .insert(
          testFolders.map(f => ({
            name: f.name
          }))
        )
        .into('folders');
    });

    afterEach(async () => {
      await postgrator.migrate('000');
    });
    it('GET /api/notes returns all notes', () => {});

    it('POST /api/notes adds folder and returns id', () => {});

    it('GET /api/notes/:folder_id responds with 200 and specified folder', () => {});

    it('DELETE /api/notes/:folder_id responds with 204 and deletes specific folder', () => {});

    it('PATCH /api/notes/folder_id responds with 204 and updates the specific folder', () => {});
  });

  context('Given there are notes in the test db', () => {
    beforeEach(async () => {
      await postgrator.migrate('002');
      await db
        .insert(
          testFolders.map(f => ({
            name: f.name
          }))
        )
        .into('folders');
      await db
        .insert(
          // insert test notes without id
          testNotes.map(n => ({
            name: n.name,
            content: n.content,
            folder_id: n.folder_id,
            date_created: n.date_created,
            date_modified: n.date_modified
          }))
        )
        .into('notes');
    });

    afterEach(async () => {
      await postgrator.migrate('000');
    });

    it('GET /api/notes returns all notes', () => {
      return supertest(app)
        .get('/api/notes')
        .expect(200, testNotes);
    });

    it('POST /api/notes adds note and returns id', () => {
      const testNote3 = {
        name: 'Test Note 3',
        content: 'Test Note 3 Content',
        folder_id: 1
      };
      const testNote3Id = 3;
      return supertest(app)
        .post('/api/notes')
        .send(testNote3)
        .expect(201)
        .expect(res => {
          expect(res.body).to.equal(testNote3Id);
          expect(res.headers.location).to.eql(`/api/notes/${testNote3Id}`);
        });
    });

    it('GET /api/notes/:note_id responds with 200 and specified folder', () => {
      return supertest(app)
        .get('/api/notes/1')
        .expect(200, testNotes[0]);
    });

    it('DELETE /api/notes/:note_id responds with 204 and deletes specified note', () => {
      const id = testNotes[0].id;
      console.log('this is the delete endpoint', `/api/notes/${id}`);
      return supertest(app)
        .delete('/api/notes/' + id)
        .expect(204)
        .then(() => {
          return db
            .select('*')
            .from('notes')
            .where({ id });
        })
        .then(note => {
          expect(note).to.eql([]);
        });
    });

    it('PATCH /api/notes/note_id responds with 204 and updates the specified note', () => {
      const { id, name, content } = testNotes[0];
      console.log('id, name, and content of note to update', id, name, content);
      const newNote = {
        name: name + ' new',
        content: content + ' new',
        folder_id: 1
      };
      console.log('this is the newNote', newNote);
      return supertest(app)
        .patch('/api/notes/' + id)
        .send(newNote)
        .expect(204)
        .then(() => {
          return db
            .select('*')
            .from('notes')
            .where({ id })
            .first();
        })
        .then(note => {
          console.log(
            'this is the updated note returned by the database',
            note
          );
          expect(note.name).to.equal(newNote.name);
          expect(note.content).to.equal(newNote.content);
          expect(note.folder_id).to.equal(newNote.folder_id);
        });
    });
  });
});
