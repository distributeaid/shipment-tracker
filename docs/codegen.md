# Codegen

In order to generate TypeScript typings from our graphql schema we rely on a tool called [graphql-codegen](https://graphql-code-generator.com/).

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
