/** Test helpers: capture what the ux functions write, and answer prompts */
import { stripVTControlCharacters } from 'node:util'

/** Removes colors and escape sequences */
export const plain = (s: string): string => stripVTControlCharacters(s)

/** Runs fn capturing (and silencing) stdout and stderr */
export const capture = async (fn: () => unknown): Promise<{ stdout: string; stderr: string }> => {
  const out = { stdout: '', stderr: '' }
  const orig = { stdout: process.stdout.write, stderr: process.stderr.write }
  process.stdout.write = ((s: string) => {
    out.stdout += s
    return true
  }) as typeof process.stdout.write
  process.stderr.write = ((s: string) => {
    out.stderr += s
    return true
  }) as typeof process.stderr.write
  try {
    await fn()
  } finally {
    process.stdout.write = orig.stdout
    process.stderr.write = orig.stderr
  }
  return { stdout: plain(out.stdout), stderr: plain(out.stderr) }
}

/** Answers the next stdin reads with the given lines, without touching the real stdin */
export const answer = (...lines: string[]): (() => void) => {
  const stdin = process.stdin
  const orig = { resume: stdin.resume, pause: stdin.pause, setEncoding: stdin.setEncoding }
  stdin.resume = (() => {
    const line = lines.shift()
    if (line !== undefined) setImmediate(() => stdin.emit('data', `${line}\n`))
    return stdin
  }) as typeof stdin.resume
  stdin.pause = (() => stdin) as typeof stdin.pause
  stdin.setEncoding = (() => stdin) as typeof stdin.setEncoding
  return () => Object.assign(stdin, orig)
}
