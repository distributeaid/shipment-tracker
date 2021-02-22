# Distribute Aid Shipment Tracker

[Project goals and background](https://www.notion.so/distributeaid/1-Online-Offer-Submission-form-4f40e406e5124d23a4d35280585ec88d)

[Project requirements document with user stories and proposed GraphQL schema](https://www.notion.so/distributeaid/Technical-requirements-c2fd190e0a8d4f708119c6944fa654dd)

## Dev setup

Install system dependencies:

- node.js v14.15.5
- yarn v1.22.5
- postgresql v13.2

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

Run the dev server:

`npm run dev`

And then view graphql sandbox at http://localhost:3000/graphql
