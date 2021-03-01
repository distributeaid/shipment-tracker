![CI status](https://github.com/distributeaid/shipment-tracker/actions/workflows/ci.yml/badge.svg)

# Distribute Aid Shipment Tracker

The goal of this project is to provide a system for collecting aid offers and organizing them into pallets appropriate for a shipment. Using the system, Distribute Aid administrators can create shipments, aid donors can organize their aid for donation into offers for a shipment and provide the information necessary for a Distribute Aid hub coordinator and logistics coordinator to process it for international shipping to refugees.

Key documents:

- [Project goals and background](https://www.notion.so/distributeaid/1-Online-Offer-Submission-form-4f40e406e5124d23a4d35280585ec88d)

- [Project requirements document with user stories and proposed GraphQL schema](https://www.notion.so/distributeaid/Technical-requirements-c2fd190e0a8d4f708119c6944fa654dd)

## Devopment process

### Code of conduct

First, please read our [code of conduct](https://www.notion.so/distributeaid/Code-of-Conduct-6ba4ca07a6fa4e4da9ef8ad91757c5b4).

### Issue tracking

Development tasks are managed in the github issues for this repository. The issues themselves are fairly light on detail in favor of a simple description of scope (i.e. the conditions for the task being considered "done"). For specifics on task requirements, please reference the [project requirements document](https://www.notion.so/distributeaid/Technical-requirements-c2fd190e0a8d4f708119c6944fa654dd) early and often.

Issues tagged `front end` will also be tagged with either `needs UI mock`, indicating the task still needs design work to be ready for development, or `has UI mock` indicating it's ready for dev work.

When you begin working on an issue, please self-assign or comment on it indicating you're beginning work to avoid duplicate effort.

### Pull requests

When you're ready to submit your code, open a pull request with "Closes #X" to link the relavant issue. When your PR is approved by at least one maintainer it is ready to submit.

It's easy for the intention of code review comments to be unclear or get misinterpreted. To help with communication, reviewers are encouraged to use [conventional comments](https://conventionalcomments.org/) and explicitly indicate that comments are `(blocking)`, where the discussion must be resolved for PR to be approved, or `(non-blocking)` where resolving the discussion is optional for the implementer.

## Dev setup

Install system dependencies:

- node.js v14.15.5
- yarn v1.22.5: `brew install yarn`
- postgresql v13.2: `brew install postgresql`

Install project dependencies:

- `yarn install`

Start postgres daemon:

- macOS: `brew services start postgresql`
- linux: `sudo service postgresql-13.2 start`

Next set up the development and test databases. (Make
sure `npx` is working first by running `npx --version`.)

- `./script/init_db`

Create your local environment file:

- `cp .env.example .env`

Run the dev server:

`yarn dev`

And then view graphql sandbox at http://localhost:3000/graphql

If you run into problems setting up your development environment please create an issue describing any errors you encounter.

See the README in the `frontend` directory for instructions on setting up for front end development.

## Other project docs

- [Database Migrations](./docs/migrations.md)
- [Graphql Codegen](./docs/codegen.md)

### Type definitions

We want to maintain a single source of truth for our type definitions. We use `graphql-codegen` for that purpose.

The command below will output TypeScript definitions that can be used by the backend and frontend.

```shell
yarn codegen
```

## Technologies

Shipment Tracker is a full stack TypeScript web app backed by a PostgreSQL database.

General tools:

- [TypeScript](https://www.typescriptlang.org/)
- [Yarn package manager](https://yarnpkg.com/)
- [GraphQL](https://graphql.org/)
- [GraphQL Codegen](https://graphql-code-generator.com/)
- [Prettier code formatter](https://prettier.io/)
- [Jest test framework](https://jestjs.io/)

Back end:

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize ORM](https://sequelize.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

Front end:

- [React.js](https://reactjs.org/)
- [React Router](https://reactrouter.com/web/guides/quick-start)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Tailwind CSS](https://tailwindcss.com)
