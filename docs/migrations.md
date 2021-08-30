# Database Migrations

You can use the `sequelize-cli` tool via `npx` to create and run database migrations. You can read about the commands available by running:

```sh
npx sequelize-cli --help
```

## Running migrations

To run all migrations use the following command:

```sh
npx sequelize-cli db:migrate

# or if it's easier to remember:
yarn run migrate-db
```

You can rollback a single migration by running:

```sh
npx sequelize-cli db:migrate:undo
```

Or you can rollback all migration with:

```sh
npx sequelize-cli db:migrate:undo:all
```

## Creating migrations

> **Fun fact:** Sequelize has no support for generating migrations from models.

Create a new TypeScript file following the naming schema in [db/migrations](../db/migrations).

You can find more information about sequelize migration files [here](https://sequelize.org/master/manual/migrations.html#migration-skeleton).

Once you have finished writing your migration, run `npx tsc` to compile the JavaScript version of the migration.
