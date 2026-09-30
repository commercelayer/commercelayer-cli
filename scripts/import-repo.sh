#!/usr/bin/env bash
#
# Imports a standalone Commerce Layer CLI repository into this monorepo,
# preserving its full commit history.
#
#   scripts/import-repo.sh <repo> <target-dir>
#   scripts/import-repo.sh commercelayer-cli-plugin-orders plugins/orders
#
# 1. Clones the repository fresh from GitHub (only its default branch).
# 2. Rewrites its history with git filter-repo so every file lives under
#    <target-dir>, and rewrites bare `#123` references in commit messages to
#    `commercelayer/<repo>#123` so they keep pointing at the original PRs.
# 3. Keeps only stable `vX.Y.Z` tags, renamed `<dir>-vX.Y.Z` where <dir> is the
#    basename of <target-dir> (the tag convention release.yml relies on).
# 4. Merges the rewritten history into the current branch with a merge commit.
#
# filter-repo is deterministic: re-running the script later against the same
# repository produces the same commit ids, so a second run only merges the
# commits added upstream in the meantime.
#
# Tags are created locally only; pushing them is a separate, deliberate step.
#
# Requires git-filter-repo (brew install git-filter-repo).

set -euo pipefail

REPO="${1:?usage: $0 <repo> <target-dir>}"
TARGET="${2:?usage: $0 <repo> <target-dir>}"
TARGET="${TARGET%/}"
DIR="$(basename "$TARGET")"
OWNER="commercelayer"

command -v git-filter-repo >/dev/null || { echo "git-filter-repo not found" >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "Working tree is not clean" >&2; exit 1; }

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "› Cloning $OWNER/$REPO"
git clone --quiet --single-branch "https://github.com/$OWNER/$REPO.git" "$WORK/repo"
BRANCH="$(git -C "$WORK/repo" symbolic-ref --short HEAD)"

echo "› Rewriting history into $TARGET"
(
  cd "$WORK/repo"
  git filter-repo --force --quiet \
    --to-subdirectory-filter "$TARGET" \
    --tag-rename "v:$DIR-v" \
    --message-callback "
import re
return re.sub(rb'(?<![\w/])#(\d+)', rb'$OWNER/$REPO#\1', message)"
  # Stable releases only: drop prereleases and any tag outside the convention.
  git tag -l | grep -vE "^$DIR-v[0-9]+\.[0-9]+\.[0-9]+$" | while read -r t; do git tag -d "$t" >/dev/null; done
)

echo "› Merging into $(git branch --show-current)"
REMOTE="import-$DIR"
git remote add "$REMOTE" "$WORK/repo"
git fetch --quiet --no-tags "$REMOTE" "$BRANCH"
git fetch --quiet "$REMOTE" "refs/tags/$DIR-v*:refs/tags/$DIR-v*"
git merge --quiet --allow-unrelated-histories --no-edit \
  -m "chore: import $REPO into $TARGET" \
  -m "History imported from $OWNER/$REPO ($BRANCH) with git filter-repo; stable tags renamed to $DIR-vX.Y.Z." \
  -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" \
  "$REMOTE/$BRANCH"
git remote remove "$REMOTE"

echo "✓ Imported $REPO: $(git rev-list --count HEAD -- "$TARGET") commits touching $TARGET, $(git tag -l "$DIR-v*" | wc -l | tr -d ' ') tags"
