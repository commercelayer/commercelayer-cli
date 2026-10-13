#!/usr/bin/env node
// The sources are TypeScript, run through tsx: no build step, as for cl-generate
import { register } from 'tsx/esm/api'

register()
await import('../src/cli.ts')
