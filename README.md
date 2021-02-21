# Distribute Aid

## Dev setup

Install system dependencies:

- node.js v14.15.5
- npm v7.5.4
- postgresql v13.2

Install project dependencies:

- `npm install`

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
