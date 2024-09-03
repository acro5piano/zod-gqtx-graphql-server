# zod-gqtx-graphql-server

An example app to demonstrate how to share types between Zod and GraphQL.

# Motivation

Writing types by hand can be tedious, especially when dealing with numerous entities and fields. However, it's common to define types in multiple places within an app.

The idea is to use Zod as the single source of truth:

- For entities (models), define the types using Zod.
- For GraphQL types, derive the types from Zod.
- For database types, use the entity types directly.
- For server-side validation, use the Zod schema.
- For frontend validation, import the Zod schema and use it with react-hook-form or a similar library.

### FAQ

> Why not tRPC?

tRPC is great, but it has some downsides that I can't overlook:

- TypeScript lock-in
- Inability to retrieve related objects
- Inability to filter fields on the client side

While the idea is promising, combining GraphQL with Zod should work well too.

> Why gqtx?

gqtx provides an excellent type experience right out of the box. Nexus could also be used, but there's no strong preference.

> Why Zod?

The ecosystem is robust.

> What about the frontend?

React + URQL is my favorite, but it’s outside the scope of this repository.

> What about database definitions?

Hmm... There is a code generator for Zod + Postgres, but I recommend writing the schema by hand. Databases are complex, and you may need additional steps to get things working. This is a TODO.

# Running the App

To install dependencies:

```bash
bun install
```

To run the app:

```bash
bun run --watch src/main.ts
```

# Possible TODOs

- [ ] Enum values GQL map
- [ ] Nullish handling both in type & input
- [ ] Generate mutations. Writing mutations by hand is tedious; let's automate it.
- [ ] Generate Zod interfaces. We currently have to write `z.infer` manually each time.
- [ ] Create database migrations as described above.
