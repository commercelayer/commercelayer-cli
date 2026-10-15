/**
 * Commit messages follow Conventional Commits: the release scripts derive
 * versions (conventional-recommended-bump) and release notes
 * (conventional-changelog) from them, so a malformed message means a wrong
 * version or a missing note. Checked on every pull request (verify.yml), and
 * so is the pull request title (pr-title.yml), the message of its merge commit.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  // The release commits are written by `pnpm release:prepare` and list
  // every released tag in the header, well past the length limit
  ignores: [(message) => message.startsWith('chore(release): ')],
  // Merge commits ("Merge branch 'main' into …") are allowed in a pull
  // request, not as its title (COMMITLINT_PR_TITLE, set by pr-title.yml)
  defaultIgnores: !process.env.COMMITLINT_PR_TITLE,
}
