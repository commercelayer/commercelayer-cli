/**
 * Commit messages follow Conventional Commits: the release scripts derive
 * versions (conventional-recommended-bump) and release notes
 * (conventional-changelog) from them, so a malformed message means a wrong
 * version or a missing note. Checked on every pull request (verify.yml).
 */
export default {
  extends: ['@commitlint/config-conventional'],
  // The release commits are written by `pnpm release:version` and list
  // every released tag in the header, well past the length limit
  ignores: [(message) => message.startsWith('chore(release): ')],
}
