#!/bin/sh
# Installs the repository's skills for Claude Code and Codex. The copies in
# this directory are the source of truth: edit them here, commit, then run
#   sh skills/install.sh
set -e
here="$(cd "$(dirname "$0")" && pwd)"
for skill in coin-component-docs; do
  for target in "$HOME/.claude/skills" "$HOME/.codex/skills"; do
    mkdir -p "$target/$skill"
    rsync -a --delete "$here/$skill/" "$target/$skill/"
    echo "Installed $skill -> $target/$skill"
  done
done
