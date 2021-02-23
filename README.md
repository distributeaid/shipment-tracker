![CI status](https://github.com/distributeaid/shipment-tracker/actions/workflows/ci.yml/badge.svg)

# Distribute Aid Shipment Tracker

[Project goals and background](https://www.notion.so/distributeaid/1-Online-Offer-Submission-form-4f40e406e5124d23a4d35280585ec88d)

[Project requirements document with user stories and proposed GraphQL schema](https://www.notion.so/distributeaid/Technical-requirements-c2fd190e0a8d4f708119c6944fa654dd)

## Dev setup

Install system dependencies:

- node.js v14.15.5
- yarn v1.22.5: `brew install yarn`
- postgresql v13.2: `brew install postgresql`

Install project dependencies:

- `yarn install`

Initialize postgres databases for development:

- macOS: `brew services start postgresql`
- linux: `sudo service postgresql-13.2 start`

then

```
createdb distributeaid_dev &&
  createdb distributeaid_test &&
  psql -d distributeaid_dev -c "create user distributeaid;" &&
  psql -d distributeaid_dev -c "grant all privileges on database distributeaid_dev to distributeaid;" &&
  psql -d distributeaid_dev -c "grant all privileges on database distributeaid_test to distributeaid;" &&
  npx sequelize-cli db:migrate
```

If these command fail due to `could not connect to server: No such file or directory`, check the log file at `/usr/local/var/log/postgres.log`. If you see an error that looks similar to `The data directory was initialized by PostgreSQL version 11, which is not compatible with this version 13.2`, you have a previous version of postgresql installed that is conflicting with this one. The easiest way to resolve this is to `mv` the old data directory and run `initdb` with the new version of postgres. See https://gist.github.com/olivierlacan/e1bf5c34bc9f82e06bc0 for more details.

Run the dev server:

`npm run dev`

And then view graphql sandbox at http://localhost:3000/graphql
