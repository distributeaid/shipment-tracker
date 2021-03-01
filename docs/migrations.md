# Database Migrations

You can use the `sequelize-cli` tool via `npx` to create and run database migrations. You can ready about the commands available by running:

```sh
npx sequelize-cli --help
```

## Running migrations

To run all migrations use the following command:

```sh
npx sequelize-cli db:migrate
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

To create a new migration skeleton run:

```sh
npx sequelize-cli db:migration:create --name <migration-name>
```

this will generate a dated file under `db/migrations` with a sequelize migration skeleton inside, which will look something like:

```javascript
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
```

You can find more information about sequelize migration files [here](https://sequelize.org/master/manual/migrations.html#migration-skeleton).
