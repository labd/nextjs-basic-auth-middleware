export function createAuthorizationHeader(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`, 'binary').toString(
    'base64'
  )}`
}
