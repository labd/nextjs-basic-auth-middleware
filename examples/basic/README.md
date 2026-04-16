# Basic Auth Middleware Example

A minimal [Next.js](https://nextjs.org/) example using `nextjs-basic-auth-middleware`.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and authenticate with `test:test`.

## How it works

The `middleware.ts` file in the project root uses `createNextAuthMiddleware` to protect all routes with basic authentication.
