![CI status](https://github.com/distributeaid/shipment-tracker/actions/workflows/ci.yml/badge.svg)

# Distribute Aid Shipment Tracker

The goal of this project is to provide a system for collecting aid offers and organizing them into pallets appropriate for a shipment. Using the system, Distribute Aid administrators can create shipments, aid donors can organize their aid for donation into offers for a shipment and provide the information necessary for a Distribute Aid hub coordinator and logistics coordinator to process it for international shipping to refugees.

Key documents:

- [Project goals and background](https://www.notion.so/distributeaid/1-Online-Offer-Submission-form-4f40e406e5124d23a4d35280585ec88d)

- [Project requirements document with user stories and proposed GraphQL schema](https://www.notion.so/distributeaid/Technical-requirements-c2fd190e0a8d4f708119c6944fa654dd)

- [Map of the codebase](https://app.codesee.io/maps/public/b7367890-0129-11ec-a91a-57f039601939)

## Deployments

### Staging

The main `saga` branch is deployed automatically to CleverCloud by CI. Staging can be accessed here:

https://shipment-tracker-saga.distributeaid.dev/

## Devopment process

### Code of conduct

First, please read our [code of conduct](https://www.notion.so/distributeaid/Code-of-Conduct-6ba4ca07a6fa4e4da9ef8ad91757c5b4).

### Issue tracking

Development tasks are managed in the github issues for this repository. The issues themselves are fairly light on detail in favor of a simple description of scope (i.e. the conditions for the task being considered "done"). For specifics on task requirements, please reference the [project requirements document](https://www.notion.so/distributeaid/Technical-requirements-c2fd190e0a8d4f708119c6944fa654dd) early and often.

Issues tagged `front end` will also be tagged with either `needs UI mock`, indicating the task still needs design work to be ready for development, or `has UI mock` indicating it's ready for dev work.

When you begin working on an issue, please self-assign or comment on it indicating you're beginning work to avoid duplicate effort.

### Pull requests

When you're ready to submit your code, open a pull request with "Closes #X" to link the relevant issue. When your PR is approved by at least one maintainer it is ready to submit.

It's easy for the intention of code review comments to be unclear or get misinterpreted. To help with communication, reviewers are encouraged to use [conventional comments](https://conventionalcomments.org/) and explicitly indicate that comments are `(blocking)`, where the discussion must be resolved for PR to be merged, or `(non-blocking)` where resolving the discussion is optional for the implementer.

#### Approval and merging

Reviewers should grant approval if they do not feel additional review is necessary before merging. This does not necessarily mean no more changes are required before merging, but that any further changes are expected to be minor enough to not require review.

If the pull request does not require additional changes, the reviewer should merge it immediately after approving. Otherwise, the pull request author should merge (if able) once they have addressed all comments marked `(blocking)` or `nit`. Contributors are encouraged to at least reply to `(non-blocking)` and `(if-minor)` comments if they do not address them with code changes.

## Dev setup

### Using a DevContainer

We provide a pre-configured environment which is configured so you are ready to run the test suite and the development server.

#### Using the DevContainer with GitHub CodeSpaces in your browser

You can launch a dedicated environment for directly from GitHub using Codespaces: select the green **Code** dropdown and then **New codespace**. [Learn more about Codespaces](https://github.com/features/codespaces).

After your DevContainer has been bootstrapped, you can run the tests by opening a Terminal in VS Code in the browser (Select **View** -> **Terminal**, or press Ctrl+`), and then run the command:

    npm test

Because of limitiations with the networking (specifically setting up the neccessary hostnames for proper CORS), running the development server in codespaces is not yet possible.

#### Using the Devcontainer with Visual Studio Code locally

You can launch a dedicated environment after cloning the project in [Visual Studio Code](https://code.visualstudio.com/): follow the [installation instructions](https://code.visualstudio.com/docs/remote/containers) (you need the [Remote Development Extension pack](https://aka.ms/vscode-remote/download/extension), then select the green **Remote** icon and then **Reopen in Container**. [Learn more about Remove development in Containers](https://code.visualstudio.com/docs/remote/containers-tutorial).

After your DevContainer has been bootstrapped, you can run the tests by opening a Terminal in VS Code in the browser (Select **View** -> **Terminal**, or press Ctrl+`), and then run the command:

    npm test

You can also run the development server and the frontend. Open a new terminal and start the development server:

    yarn dev

Then, open a second terminal, navigate to the `./frontend` directory and run:

    yarn install --frozen-lockfile
    yarn start

You can click on the printed URLs to open them in a browser.

### Using your local machine

1. Install Node.js 16:
   1. Install with [nodenv](https://github.com/nodenv/nodenv)
   2. or [nvm](https://github.com/nvm-sh/nvm)
1. Switch to Node 16 if needed. nodenv should do it automatically, but with nvm you'll need to run `nvm use 16`
1. Install the dependencies: `yarn install --frozen-lockfile`
1. Build the project: `yarn build`
1. Install postgresql: `brew install postgresql@13`
1. Start postgresql: `brew services start postgresql@13`
1. Launch the PostgreSQL CLI: `psql -d postgres`
1. Run all these commands consecutively:

   ```postgres
   CREATE USER distributeaid_test;
   ALTER USER distributeaid_test PASSWORD 'distributeaid_test';
   CREATE DATABASE distributeaid_test;

   CREATE USER distributeaid;
   ALTER USER distributeaid PASSWORD 'distributeaid';
   CREATE DATABASE distributeaid_dev;
   ```

1. Seed the database:
   ```shell
   npx sequelize-cli --env=test db:migrate
   npx sequelize-cli --env=development db:migrate
   ```
1. Start the backend: `yarn dev`

You're now ready to run the frontend of the app:

1. Navigate to the `frontend` directory
2. Make sure you're using Node 16
3. Install the dependencies: `yarn install --frozen-lockfile`
4. Start the dev server: `yarn start`

You should now be able to run the project locally!

If this is your first time, you'll probably want to create an account. You can use the UI to do that:

1. Navigate to the login page: http://localhost:8080/
2. Register a new account
3. When asked for an email confirmation, check your terminal! There will be a confirmation token.
4. Once confirmed, enter your password again to log in.
5. To make yourself an admin, run: `node cli admin <youremail@domain.com>`

## Technical documentation

- [Database Migrations](./docs/migrations.md)
- [Graphql Codegen](./docs/codegen.md)

### Type definitions

We want to maintain a single source of truth defining types used on both the API server and browser client. We use [GraphQL Codegen](https://graphql-code-generator.com/) for that purpose.

Types are defined in `schema.graphql`. Type code for TypeScript is generated from that schema file using the command `yarn codegen`. This will update the type definition files at

- `./src/server-internal-types.ts` for the server
- `./frontend/src/types/api-types.ts` for the browser client

You can use `yarn codegen` to generate the code, or you can use `yarn dev` to generate and watch changes to the schema.

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
