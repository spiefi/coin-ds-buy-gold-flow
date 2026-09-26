# Coin DS — agent instructions

This repository contains one thing: the Coin DS designer documentation site
in `designer-docs/` (live at <https://coin-designer-docs.vercel.app>).

- For any work on the site, follow `designer-docs/AGENTS.md`.
- To build or revise component guides, use the `coin-component-docs` skill.
  Its source is `skills/coin-component-docs/`; after editing it, run
  `sh skills/install.sh` to update the Claude Code and Codex copies.
- Docs worker agents: `.claude/agents/coin-docs-worker.md` (Claude Code) and
  `.codex/agents/coin_docs_worker.toml` (Codex).

The former product app (Buy Gold flow and other screens) and its screen
tooling were removed on 26 September 2026. They are preserved on the local
branch `archive/product-app`.

## Releasing

Push to `main`. `.github/workflows/designer-docs.yml` runs `npm run verify`
and deploys to Vercel only if it passes. Never deploy by hand.

## GitHub publishing

- Use the repository's Git credentials for branches, commits, and pushes.
  An invalid `gh auth status` alone is not a blocker: first check access with
  `git ls-remote origin HEAD`.
- Ask the user to reauthenticate only after Git remote access fails.
- Never write access tokens, credentials, or secrets into repository files.
  The Vercel token lives only in the `VERCEL_TOKEN` repository secret.
