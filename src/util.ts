import { Gql, type Field, type InputFieldMap } from 'gqtx'
import { z } from 'zod'

export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}

export function zodTypeToGqlFields<T extends z.ZodRawShape>(
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

export function zodTypeToGqlInputFields<Src, T extends z.ZodRawShape>(
  inputFields: z.ZodObject<T>,
) {
  return function fields(): InputFieldMap<Src> {
    const fields = {} as any
    for (const key of keys(inputFields.shape)) {
      fields[key] = { type: Gql.String }
    }
    return fields
  }
}
