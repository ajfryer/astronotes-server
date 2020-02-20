const knex = require('knex');
require('dotenv').config();
const Postgrator = require('postgrator');

const app = require('../src/app');

describe('folders endpoint', () => {
  let db;

  // test fixtures
  const testFolders = [
    { id: 1, name: 'Test Folder 1' },
    { id: 2, name: 'Test Folder 2' }
  ];

  const testNotes = [
    {
      id: 1,
      title: 'Test Note 1',
      content: 'Test Note 1 Content',
      folder_id: 1,
      date_created: '2020-02-17T07:39:05.649Z',
      date_modified: '2020-02-17T07:39:05.649Z'
    },
    {
      id: 2,
      title: 'Test Note 2',
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

  context('Given there are no folders in the test db', () => {
    beforeEach(async () => {
      await postgrator.migrate('002');
    });

    afterEach(async () => {
      await postgrator.migrate('000');
    });

    it('GET /api/folders responds with 200 and an empty list', () => {
      return supertest(app)
        .get('/api/folders')
        .expect(200, []);
    });
  });

  context('Given there are folders in the test db', () => {
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

    it('GET /api/folders returns all folders', () => {
      return supertest(app)
        .get('/api/folders')
        .expect(200, testFolders);
    });

    it('POST /api/folders adds folder and returns id', () => {
      const folder = { id: 3, name: 'Test Folder 3' };
      return supertest(app)
        .post('/api/folders/')
        .send(folder)
        .expect(201)
        .expect(res => {
          expect(res.body).to.eql({ id: folder.id });
          expect(res.headers.location).to.eql(`/api/folders/${folder.id}`);
        });
    });

    it('GET /api/folders/:folder_id responds with 200 and specified folder', () => {
      return supertest(app)
        .get('/api/folders/1')
        .expect(200, testFolders[0]);
    });

    it('DELETE /api/folders/:folder_id responds with 204 and deletes specific folder', () => {
      const id = testFolders[0].id;
      return supertest(app)
        .delete('/api/folders/' + id)
        .expect(204)
        .then(() => {
          return db
            .select('*')
            .from('folders')
            .where({ id });
        })
        .then(folder => {
          expect(folder).to.eql([]);
        });
    });

    it('PATCH /api/folders/folder_id responds with 204 and updates the specific folder', () => {
      const { id, name } = testFolders[0];
      const newFolder = {
        name: name + 'new'
      };
      return supertest(app)
        .patch('/api/folders/' + id)
        .send(newFolder)
        .expect(204)
        .then(() => {
          return db
            .select('*')
            .from('folders')
            .where({ id })
            .first();
        })
        .then(folder => {
          expect(folder.name).to.eql(newFolder.name);
        });
    });
  });
});
