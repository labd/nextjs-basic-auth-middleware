---
"nextjs-basic-auth-middleware": patch
---

Fix security and correctness issues in auth middleware

- Catch exceptions from malformed auth headers (returns 401 instead of 500)
- Fix parseCredentials to allow colons in passwords (split on first colon only)
- Eliminate timing leak in compareCredentials (always evaluate both comparisons)
- Remove dead pathname option that had no effect
