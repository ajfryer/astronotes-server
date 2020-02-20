/*
 * astronotes server
 * backend to astronotes - notetaking for spaceheads
 */

const { PORT, DATABASE_URL } = require('./config'); // env configs
const app = require('./app'); // express app
const logger = require('./logger'); // application logger
const knex = require('knex'); // db query builder

// create db instance
const db = knex({
  client: 'pg',
  connection: DATABASE_URL
});

app.set('db', db); // inject db instance

// listen and handle requests
app.listen(PORT, () => {
  logger.info('server is listening on port ' + PORT);
});
