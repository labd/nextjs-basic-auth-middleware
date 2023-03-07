// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest()

// Any custom config you want to pass to Jest
const customJestConfig = {
  coverageProvider: 'v8',
  testMatch: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],
  verbose: true,
  transformIgnorePatterns: ['/next[/\\\\]dist/', '/\\.next/'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
