import { Gql, type Field, type InputFieldMap } from 'gqtx'
import { z } from 'zod'

export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}

export function zodTypeToGqlFields<T extends z.ZodRawShape>(
  publicFields: z.ZodObject<T>,
  ...additionalFields: Field<z.infer<z.ZodObject<T>>, any, {}>[]
) {
  type F = any
  type GqlFields = [Field<F, any, {}>, ...Field<F, any, {}>[]]
  const fields: GqlFields = [
    Gql.Field({ name: 'id', type: Gql.NonNull(Gql.ID) }),
  ]
  for (const key of keys(publicFields.shape)) {
    fields.push(Gql.Field({ name: key as any, type: Gql.NonNull(Gql.String) }))
  }
  for (const f of additionalFields) {
    fields.push(f)
  }
  return fields
}

export function zodTypeToGqlInputFields<Src, T extends z.ZodRawShape>(
  inputFields: z.ZodObject<T>,
): InputFieldMap<Src> {
  const fields = {} as any
  for (const key of keys(inputFields.shape)) {
    fields[key] = { type: Gql.String }
  }
  return fields
}

export type MakeId<Brand extends string> = string & { __brand?: Brand }

export const uuidValidate = z.string().uuid()

export function brandedUuid<T extends string>() {
  return z.custom<T>(
    (val) => uuidValidate.safeParse(val).success,
    'Invalid UUID',
  )
}
