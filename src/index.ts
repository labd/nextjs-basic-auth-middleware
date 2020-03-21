import { IncomingMessage, ServerResponse } from 'http'
import auth from 'basic-auth'

import {
  compareCredentials,
  parseCredentials,
  AuthCredentials,
} from './credentials'

type MiddlewareOptions = {
  realm?: string
  users?: AuthCredentials
}

/**
 * Middleware that sends a basic auth challenge to the user when enabled
 * @param req Http server incoming message
 * @param res Server response
 */
const basicAuthMiddleware = async (
  req: IncomingMessage,
  res: ServerResponse,
  { realm = 'protected', users = [] }: MiddlewareOptions
) => {
  const environmentCredentials = process.env.BASIC_AUTH_CREDENTIALS || ''
  if (environmentCredentials.length === 0 && users.length === 0) {
    return
  }

  const credentialsObject: AuthCredentials =
    environmentCredentials.length > 0
      ? parseCredentials(environmentCredentials)
      : users

  const currentUser = auth(req)
  if (!currentUser || !compareCredentials(currentUser, credentialsObject)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
    res.end('401 Access Denied')
  }
}

export default basicAuthMiddleware
