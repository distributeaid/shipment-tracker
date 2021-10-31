# Type definitions

We want to maintain a single source of truth defining types used on both the API server and browser client. We use [GraphQL Codegen](https://graphql-code-generator.com/) for that purpose.

Types are defined in `schema.graphql`. Type code for TypeScript is generated from that schema file using the command `yarn codegen`. This will update the type definition files at

- `./src/server-internal-types.ts` for the server
- `./frontend/src/types/api-types.ts` for the browser client

You can use `yarn codegen` to generate the code, or you can use `yarn dev` to generate and watch changes to the schema.
