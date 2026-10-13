import type { Package } from '../src/workspace.ts'

/** A workspace package for the tests, with `workspace:` dependencies on the named packages. */
export const pkg = (dir: string, version: string, deps: string[] = [], extra: Partial<Package> = {}): Package => {
  const name = `@cl/${dir}`
  const dependencies = Object.fromEntries(deps.map((d) => [`@cl/${d}`, 'workspace:^']))
  return { dir, path: `plugins/${dir}`, name, version, private: false, manifest: { name, version, dependencies: { chalk: '^5', ...dependencies } }, ...extra }
}
