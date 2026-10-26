---
"nextjs-basic-auth-middleware": minor
---

Publish as ESM-only. The CommonJS build (`dist/index.cjs`) is removed; the package now ships `dist/index.js` + `dist/index.d.ts` with `exports` conditions `types` and `default`. CommonJS consumers on Node.js >= 22.12 can still `require()` the package.
