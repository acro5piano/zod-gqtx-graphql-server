import { z } from 'zod'
import { brandedUuid, type MakeId } from '../util'

export type UserId = MakeId<'User'>

export const UserSchema = z.object({
  id: brandedUuid<UserId>(),
  name: z.string().min(3),
  password: z.string().min(8),
  isActive: z.boolean(),
  age: z.number().min(0),
})
export type User = z.infer<typeof UserSchema>

export const PublicUserSchema = UserSchema.omit({ password: true })
export type PublicUserType = z.infer<typeof PublicUserSchema>

export const UserInputSchema = UserSchema.omit({
  id: true,
  password: true,
  isActive: true,
})
export type UserInputType = z.infer<typeof UserInputSchema>
