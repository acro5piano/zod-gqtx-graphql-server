import { Gql } from 'gqtx'
import { zodTypeToGqlInputFields } from '../util'
import { UserInputSchema, type UserInputType } from '../models/user'

export const UserInput = Gql.InputObject<UserInputType>({
  name: 'CreateUserInput',
  fields: () => zodTypeToGqlInputFields(UserInputSchema),
})
