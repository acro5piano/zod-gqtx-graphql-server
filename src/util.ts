import { Gql, type Field, type InputFieldMap, type ScalarType } from 'gqtx'
import { z, ZodBoolean, ZodNumber, ZodOptional, ZodString, ZodType } from 'zod'

export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}

function zodScalarToGqlScalar(zodType: ZodType): null | ScalarType<any> {
  if (zodType instanceof ZodOptional) {
    return zodScalarToGqlScalar(zodType.unwrap())
  }
  if (zodType instanceof ZodString) {
    return Gql.String
  }
  if (zodType instanceof ZodBoolean) {
    return Gql.Boolean
  }
  if (zodType instanceof ZodNumber) {
    if (zodType.isInt) {
      return Gql.Int
    } else {
      return Gql.Float
    }
  }
  return null
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
    const value = publicFields.shape[key]
    const gqlType = zodScalarToGqlScalar(value)
    if (gqlType) {
      if (value.isNullable()) {
        fields.push(Gql.Field({ name: key as string, type: gqlType }))
      } else {
        fields.push(
          Gql.Field({ name: key as string, type: Gql.NonNull(gqlType) }),
        )
      }
    }
  }
  for (const f of additionalFields) {
    fields.push(f)
  }
  return fields
}

export function zodTypeToGqlInputFields<Src, T extends z.ZodRawShape>(
  inputFields: z.ZodObject<T>,
): InputFieldMap<Src> {
  const fields: InputFieldMap<any> = {}
  for (const key of keys(inputFields.shape)) {
    const value = inputFields.shape[key]
    const gqlType = zodScalarToGqlScalar(value)
    if (gqlType) {
      if (value.isNullable()) {
        fields[key] = { type: gqlType }
      } else {
        fields[key] = { type: Gql.NonNullInput(gqlType) }
      }
    }
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

export type NullishObject<T extends object> = {
  [k in keyof T]: null | T[k]
}
