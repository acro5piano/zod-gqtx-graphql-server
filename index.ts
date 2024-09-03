import { buildGraphQLSchema, Gql, type Field } from 'gqtx'
import { createYoga } from 'graphql-yoga'
import { z } from 'zod'

export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}

const UserSchema = z.object({
  id: z.string().uuid().brand<'User'>(),
  name: z.string().min(3),
  password: z.string().min(8),
})
type User = z.infer<typeof UserSchema>

const PostSchema = z.object({
  id: z.string().uuid().brand<'Post'>(),
  userId: z.string().uuid().brand<'User'>(),
  title: z.string().min(5).max(50),
})
type Post = z.infer<typeof PostSchema>

const PublicUserFields = UserSchema.omit({ password: true })
type PublicUserType = z.infer<typeof PublicUserFields>

function zodTypeToGqlFields<T extends z.ZodRawShape>(
  publicFields: z.ZodObject<T>,
  ...additionalFields: Field<T, any, {}>[]
) {
  type F = any
  type GqlFields = [Field<F, any, {}>, ...Field<F, any, {}>[]]
  return function fields() {
    const fields: GqlFields = [
      Gql.Field({ name: 'id', type: Gql.NonNull(Gql.ID) }),
    ]
    for (const key of keys(publicFields.shape)) {
      fields.push(
        Gql.Field({ name: key as any, type: Gql.NonNull(Gql.String) }),
      )
    }
    for (const f of additionalFields) {
      fields.push(f)
    }
    return fields
  }
}

const UserType = Gql.Object<PublicUserType>({
  name: 'User',
  fields: zodTypeToGqlFields(
    PublicUserFields,
    Gql.Field({
      name: 'greeting',
      type: Gql.NonNull(Gql.String),
      resolve: (user) => {
        return `Hello, ${user.name}`
      },
    }),
  ),
})

// const CreateUserInput = Gql.InputObject({
//   name: 'CreateUserInput',
//   fields: () => UserSchema.omit({ password: true }),
// })

type Database = {
  user: User[]
  post: Post[]
}

const db: Database = {
  user: [],
  post: [],
}

const QueryType = Gql.Query({
  fields: () => [
    Gql.Field({
      name: 'users',
      type: Gql.NonNull(Gql.List(Gql.NonNull(UserType))),
      resolve: (_) => {
        return db.user.map((u) => ({ id: u.id, name: u.name }))
      },
    }),
  ],
})

// const MutationType = Gql.Query({
//   fields: () => [
//     Gql.Field({
//       name: 'createUser',
//       type: Gql.NonNull(Gql.List(Gql.NonNull(UserType))),
//       args: {
//         input: Gql.Arg({ type: Gql.NonNullInput(CreateUserInput) }),
//       },
//       resolve: (_, args) => {
//         return db.user.push(args.input)
//       },
//     }),
//     // Gql.Field({
//     //   name: 'createPost',
//     //   type: Gql.NonNull(Gql.List(Gql.NonNull(UserType))),
//     //   resolve: (_) => {
//     //     return db.user
//     //   },
//     // }),
//   ],
// })

export const schema = buildGraphQLSchema({
  query: QueryType,
  // mutation: MutationType,
})

export const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  healthCheckEndpoint: '/api/health',
  logging: 'debug',
})

// @ts-ignore
Bun.serve({ fetch: yoga, port: 8080 })

console.log('listening on :8080')
