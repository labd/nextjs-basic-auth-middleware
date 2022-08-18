import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { MiddlewareOptions } from 'types'
import { basicAuthentication } from './lib/auth'
import {
  AuthCredentials,
  compareCredentials,
  parseCredentials
} from './lib/credentials'
import { pathInRequest } from './lib/path'

/**
 * Creates a default Next middleware function that returns `NextResponse.next()` if the basic auth passes
 * @param req Next middleware request
 * @param options Options object based on MiddlewareOptions
 * @returns Either a 401 error or goes to the next page
 */
export const createNextMiddleware = ({
  realm = 'protected',
  users = [],
  includePaths = ['/'],
  excludePaths = [],
}: MiddlewareOptions = {}) => (req: NextRequest) =>
  nextBasicAuthMiddleware({ realm, users, includePaths, excludePaths }, req)

export const nextBasicAuthMiddleware = (
  {
    realm = 'protected',
    users = [],
    includePaths = ['/'],
    excludePaths = [],
  }: MiddlewareOptions = {},
  req: NextRequest
) => {
  // Check if credentials are set up
  const environmentCredentials = process.env.BASIC_AUTH_CREDENTIALS || ''
  if (environmentCredentials.length === 0 && users.length === 0) {
    // No credentials set up, continue rendering the page as normal
    return NextResponse.next()
  }

  // Retrieve paths from environment credentials or use arguments
  const includeAuth = process.env.BASIC_AUTH_PATHS
    ? process.env.BASIC_AUTH_PATHS.split(';')
    : includePaths
  const excludeAuth = process.env.BASIC_AUTH_EXCLUDE_PATHS
    ? process.env.BASIC_AUTH_EXCLUDE_PATHS.split(';')
    : excludePaths

  // Check whether the path of the request should even be checked
  if (pathInRequest(excludeAuth, req) || !pathInRequest(includeAuth, req)) {

    // Current path not part of the checked settings
    return NextResponse.next()
  }

  const credentialsObject: AuthCredentials =
    environmentCredentials.length > 0
      ? parseCredentials(environmentCredentials)
      : users

  const authHeader = req.headers.get('authorization')

  if (authHeader) {
    const currentUser = basicAuthentication(authHeader)

    if (currentUser && compareCredentials(currentUser, credentialsObject)) {
      return NextResponse.next()
    }
  }


  return new NextResponse('401 Access Denied', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}"`,
    },
  })
}
