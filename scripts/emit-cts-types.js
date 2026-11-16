// Mirrors dist/**/*.d.ts as .d.cts so `require` consumers get CommonJS-typed declarations
// (the package is "type": "module", so plain .d.ts files are always read as ESM).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const relativeJs = /((?:from\s*|import\()['"]\.\.?\/[^'"]*?)\.js(['"])/g

for (const file of readdirSync(dist, { recursive: true })) {
  if (!file.endsWith('.d.ts')) continue
  const src = readFileSync(join(dist, file), 'utf8')
  writeFileSync(join(dist, file.replace(/\.d\.ts$/, '.d.cts')), src.replace(relativeJs, '$1.cjs$2'))
}
