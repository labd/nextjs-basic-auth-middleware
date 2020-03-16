import { IncomingMessage, ServerResponse } from 'http'
import auth from 'basic-auth'
import compare from 'tsscmp'

type AuthCredentials = {
  name: string
  password: string
}

const parseCredentials = (credentials: string): AuthCredentials => {
  if (credentials.length < 3) {
    throw new Error(
      `Received incorrect basic auth syntax, use <username>:<password>, received ${credentials}`
    )
  }
  const parsedCredentials = credentials.split(':')
  if (parsedCredentials[0].length === 0 || parsedCredentials[1].length === 0) {
    throw new Error(
      `Received incorrect basic auth syntax, use <username>:<password>, received ${credentials}`
    )
  }
  return {
    name: parsedCredentials[0],
    password: parsedCredentials[1],
  }
}

/**
 * Compares the basic auth credentials with the configured user and password
 * @param credentials Basic Auth credentials object from `basic-auth`
 */
const compareCredentials = (
  credentials: auth.BasicAuthResult,
  requiredCredentials: AuthCredentials
): boolean => {
  let valid = true

  valid = compare(credentials.name, requiredCredentials.name) && valid
  valid = compare(credentials.pass, requiredCredentials.password) && valid

  return valid
}

/**
 * Middleware that sends a basic auth challenge to the user when enabled
 * @param req Http server incoming message
 * @param res Server response
 */
const basicAuthMiddleware = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const envCredentials = process.env.BASIC_AUTH_CREDENTIALS || ''
  if (envCredentials.length > 0) {
    const requiredCredentials = parseCredentials(envCredentials)

    const credentials = auth(req)
    if (!credentials || !compareCredentials(credentials, requiredCredentials)) {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="protected"')
      res.end('401 Access Denied')
    }
  }
}

export default basicAuthMiddleware
