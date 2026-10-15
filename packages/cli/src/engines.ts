/**
 * The Node.js version a CLI release requires (`engines.node`, as `>=22.13`).
 *
 * No imports: bin/run.js requires this before anything else, because on an
 * older Node.js the CLI fails while loading (ERR_REQUIRE_ESM) with no useful
 * message, and the update command checks a release before installing it.
 */

type Manifest = { name?: string; version?: string; engines?: { node?: string } }

const parts = (version: string): number[] => {
  const [major = 0, minor = 0, patch = 0] = version.replace(/^v/, '').split('.').map(Number)
  return [major, minor, patch]
}

/** The minimum version of an engines range of the form `>=x[.y[.z]]`, the only form the CLI uses */
const minimumVersion = (range: string): string | undefined => /^>=\s*(\d+(?:\.\d+){0,2})$/.exec(range.trim())?.[1]

/** Whether a Node.js version satisfies the engines range (true for a range of another form: npm decides) */
const satisfiesNode = (range: string | undefined, node: string): boolean => {
  const minimum = range ? minimumVersion(range) : undefined
  if (!minimum) return true
  const [a, b] = [parts(node), parts(minimum)]
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]
  return true
}

/** The Node.js range a release requires when the given Node.js version doesn't satisfy it */
const unsupportedNode = (manifest: Manifest, node: string): string | undefined => {
  const range = manifest.engines?.node
  return satisfiesNode(range, node) ? undefined : range
}

/** The message bin/run.js prints when the running Node.js is too old for this CLI */
const nodeErrorMessage = (manifest: Manifest, node: string): string | undefined => {
  const range = unsupportedNode(manifest, node)
  if (!range) return undefined
  const major = Number((manifest.version ?? '').split('.')[0])
  const previous = major > 1 ? `, or install the previous CLI major, which supports older Node.js versions:\n\n  npm install -g ${manifest.name}@${major - 1}` : ''
  return `\nCommerce Layer CLI ${manifest.version} requires Node.js ${range} (current: ${node}).\nUpdate Node.js${previous}\n`
}

export { nodeErrorMessage, satisfiesNode, unsupportedNode }
