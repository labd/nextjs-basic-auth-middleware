# Changelog

## 3.1.0

### Minor Changes

- 598cca4: Properly minify modules
  Move towards ESM first with CommonJS as secondary output

## 3.0.1

### Patch Changes

- Add artifacts to NPM release

## 3.0.0

### Major Changes

- Use middleware responses instead of api page redirect

  This removes the `createApiPage` export and uses Middleware responses to serve
  a 401 when basic authentication fails. This requires `next` >=13.1.

  This is a much cleaner and less hacky approach to return the correct status code to a browser.

  :warning: This is a _breaking_ change, please use v2 if you are below `next` 13.1

## 2.0.0

- BREAKING CHANGE: Removes SSR Middleware
- BREAKING CHANGE: Updates Next.js middleware to use API pages for 401 error message

## 1.0.0

- Adds first version of the Next.js middleware

## 0.2.1

- fix(middleware): return true when request object does not have a url

## 0.2.0

- fix(auth): fix empty credentials returning valid authorization
- fix(middleware): allow optional use of options object
- chore: update all dependencies
