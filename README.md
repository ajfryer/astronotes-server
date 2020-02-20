# astronotes-server

backend for astronotes - notetaking for spaceheads. Serves [astronotes-client](https://github.com/ajfryer/astronotes-client).

## Setup

1. Configure postgres server, set timezone to UTC
2. Create `astronotes` and optional `astronotes_test` databases in Postgres
3. Create `.env` with DATABASE_URL and TEST_DATABASE_URL
4. `yarn`
5. Migrate database with `yarn migrate 2`

## Seed data

Optionally insert dummy seed data

`psql -d astronotes -f seeds/seed.dummy-data.sql`

Remove seed data

`psql -d astronotes -f seeds/trunc.dummy-data.sql`

## Scripts

Start server: `yarn start`

Start server with auto-restart on file change: `yarn dev`

Run tests: `yarn test`

Deploy: `yarn deploy`

Migrate DB: `yarn migrate [0-2]`
