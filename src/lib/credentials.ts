import { BasicAuthResult } from './auth.js'
import { safeCompare } from './compare.js'

// This contains all the logic for parsing and checking credentials
type AuthCredentialsObject = {
  name: string
  password: string
}

export type AuthCredentials = AuthCredentialsObject[]

export const parseCredentials = (credentials: string): AuthCredentials => {
  const authCredentials: AuthCredentials = []

  credentials.split('|').forEach((item) => {
    if (item.length < 3) {
      throw new Error(
        `Received incorrect basic auth syntax, use <username>:<password>, received ${item}`
      )
    }
    const parsedCredentials = item.split(':')
    if (
      parsedCredentials[0].length === 0 ||
      parsedCredentials[1].length === 0
    ) {
      throw new Error(
        `Received incorrect basic auth syntax, use <username>:<password>, received ${item}`
      )
    }

    authCredentials.push({
      name: parsedCredentials[0],
      password: parsedCredentials[1],
    })
  })

  return authCredentials
}

/**
 * Compares the basic auth credentials with the configured user and password
 * @param credentials Basic Auth credentials object from `basic-auth`
 */
export const compareCredentials = (
  input: BasicAuthResult,
  requiredCredentials: AuthCredentials
): boolean =>
  requiredCredentials.some(
    (item) =>
      safeCompare(input.user, item.name) &&
      safeCompare(input.pass, item.password)
  )
