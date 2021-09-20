# CLI

The project has a command line interface which allows to safely interact with the database.

It works by launching a separate Node.js process which, like the webserver, needs to be configure to connect to the database, send emails, etc.

## Run the CLI against the production database

Export the URL to the production database in the environment variable `DATABASE_URL`. Set the environment variable `DB_ENV` to `production`.

```bash
export DB_ENV=production
export DATABASE_URL="postgresql://user:pass@example.com:5432/database"
```

Now you can run the CLI:

```bash
node cli
```
