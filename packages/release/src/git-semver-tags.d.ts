// git-semver-tags ships no types
declare module 'git-semver-tags' {
  export function getSemverTags(options?: { tagPrefix?: string; lernaTags?: boolean; package?: string; skipUnstable?: boolean; cwd?: string }): Promise<string[]>
}
