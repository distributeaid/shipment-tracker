# Database Seeders

You can use the `sequelize-cli` tool via `npx` to create and run database seeders which put default data in the database for develompent. You can read about the commands available by running:

```sh
npx sequelize-cli --help
```

## Running seeders

Seeders are run on database setup by `script/init_db`. They run sequentially like migrations. If you'd like to run them all manually you can with:

```sh
npx sequelize-cli db:seed:all
```

## Generating new seeders

To make a new seeder, run

```sh
npx sequelize-cli seed:generate --name <seeder-name>
```

and edit the generated file.
