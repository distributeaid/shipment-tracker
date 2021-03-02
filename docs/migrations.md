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

Alternatively, if you are adding a new table you can use a command similar the following in order to fill in all of the data types for the new table in the migration file:

```sh
npx sequelize-cli model:generate --name User --attributes name:string,age:number
```

The above command would generate the following migration file:

```javascript
'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.NUMBER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users')
  },
}
```

It will also generate a model file under the `src/models` directory, which you will want to delete and replace with a TypeScript file defining your new model.

You can find more information about sequelize migration files [here](https://sequelize.org/master/manual/migrations.html#migration-skeleton).
