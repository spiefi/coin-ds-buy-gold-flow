# Release and tickets

## Release

- Work on a feature branch with the platform's prefix (`claude/` or `codex/`),
  in an isolated worktree when the main checkout has unrelated changes.
  Commit only `designer-docs/` and its evidence; never `.vercel`, `dist`, or
  `node_modules`.
- Dev preview: `npm run dev -- --port 4178` from `designer-docs`. If a branch
  switch blanks the page, restart the preview (with `--force` if Vite's cache
  is stale) and check one fresh load.
- Keep work local during review. After the user approves the release, merge
  the reviewed commit to local `main` and push `origin main`. Do not ask again
  at each step. A request limited to a local merge stays local.
- Deployment is automatic: `.github/workflows/designer-docs.yml` runs
  `npm run verify` (build, guide check, headless browser test) on every push to
  `main` that touches `designer-docs/`, and deploys to Vercel production only if
  it passes. Pull requests get the same checks plus a preview deployment. Never
  deploy the docs by hand; that would put the live site out of sync with Git.
- After pushing, follow the "Designer docs" workflow run
  (`gh run list --workflow designer-docs.yml --limit 1`). If it fails, fix the
  cause and push again; report the failure rather than deploying manually.
- Once the run is green, make one targeted check of
  <https://coin-designer-docs.vercel.app/>: the changed guide loads from its
  route and one representative interaction works. End with the live guide URL.
- The workflow needs the `VERCEL_TOKEN` repository secret. If it expires, the
  deploy job fails visibly; ask the user to replace the secret (never handle
  the token yourself).

## Coin Workflow tickets

Apply when the request involves the board, including the default build request.

**Selection.** Resolve the board's actual In progress column (a contribution
status filter is not a column filter; page through results). Select component
tickets with unfinished design-documentation work for Marcin Śpiewak, using
canonical contribution records and the ticket's stated responsibility — never
another contributor's work or an unmapped legacy label alone. An explicit user
selection wins; otherwise take every eligible ticket in the column at the start
of the request, in board order. Do not add tickets moved in later or pull from
To do. If none qualifies, say so; if ownership is unclear, ask once.

**Identity.** Confirm the authenticated member is the contributor being
completed. Never complete a contribution on someone else's behalf.

**Updates.**

- Use the `coin-workflow` MCP for reads and writes. If it is unavailable, say
  so before ticket-linked work; do not substitute browser writes.
- Leave an In progress ticket there while working.
- After verification: one short work note with the result and review link,
  complete only Marcin's contribution, move the ticket to Review. Never move to
  Done; preserve a Done move the user makes.
- Re-read the ticket to confirm status and contribution. Use expected versions
  and stable idempotency keys; do not repeat writes to prove success.
- After an approved release, add a live-link note without changing status.
