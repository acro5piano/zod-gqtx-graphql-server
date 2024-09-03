# zod-gqtx-graphql-server

An example app to demonstrate how to share types between Zod and GraphQL.

# Motivation

Writing types by hand is painful especially there are lots of entities and fields. However, we tend to write types in multiple places in our app.

The idea is to use Zod as the single source of truth.

- For entities (models), define the type in Zod.
- For GraphQL Types, pick Zod types and use it
- For Database Types, us the entities type itself.
- For Validation on server, use Zod schema.
- For Validation on frontend, import Zod schema and use it with react-hook-form or something.

### FAQ

> Why not tRPC?

tRPC is great, but the downside is not ignorable to me:

- TypeScript Lock-in
- Unable to get related objects
- Unable to filter fields on client side

The idea is great, but making GraphQL + Zod combination should be great too.

> Why gqtx?

gqtx is the great type experience out of the box. Nexus can be used too. No strong reason.

> Why Zod?

The ecosystem is great.

> What about the frontend?

React + URQL is my favorite, but it's not scope of this repository.

# Getting Started

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run --watch src/main.ts
```
