import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    clean: true,
    splitting: false,
    dts: true,
    sourcemap: true,
    format: ['cjs', 'esm'],
    outDir: 'dist',
    external: ['fsevents'],
    minify: true,
    target: 'node16',
  },
])
