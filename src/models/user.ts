import { z } from 'zod'
import { brandedUuid, type MakeId } from '../util'

export type UserId = MakeId<'User'>

export const UserSchema = z.object({
  id: brandedUuid<UserId>(),
  name: z.string().min(3),
  password: z.string().min(8),
})
export type User = z.infer<typeof UserSchema>

export const PublicUserSchema = UserSchema.omit({ password: true })
export type PublicUserType = z.infer<typeof PublicUserSchema>

export const CreateUserSchema = UserSchema.omit({
  id: true,
  password: true,
}).partial()
export type CreateUserType = z.infer<typeof CreateUserSchema>
