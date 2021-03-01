# Graphql Codegen

When you introduce a change to the project's GraphQL schema (the `schema.graphql` file in the root directly) you will need to re-run the codegen tool. Makes sure to check in the generated code changes along with the change to the schema file in your PR.

## Running the codegen process

There are two ways to run the codegen process.

1. You can run a one-off codegen step with:

```sh
yarn codegen
```

2. You can start a codegen watcher in a separate terminal with:

```sh
yarn codegen:watch
```
