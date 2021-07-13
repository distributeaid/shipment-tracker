# How to interact with our database

## Tricky things

Psql ignore capitalization BUT it is case-sensitive. Silly, I know.

```shell
select * from groups; # Select everything from the "groups" table
select * from Groups; # psql will lowercase "Groups" to "groups", which will fail!
select * from "Groups"; # This will work as intended
```

Psql uses double quotes `"` for identifiers like a table or column name, but
single quotes `'` for string literals.

## Connecting to the Shipment Tracker db

```shell
# The local DB is called "distributeaid_dev"
psql distributeaid_dev

# Show the tables available
\\dt

# To show all the entries in the Groups table:
select * from "Groups"; # Note the quotes around "Group" to preserve capitalization

# Or select only the attributes you care about:
select id, name from "Groups";

# To select nested JSON fields, it gets tricky. Note the use of single and double quotes
select "primaryContact" -> 'name' as contact from "Groups";

```

Commands in no particular order:

```shell
psql --list # List the available databases
```
