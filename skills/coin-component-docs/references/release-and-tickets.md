# Release and tickets

## Release

- Work on a feature branch with the platform's prefix (`claude/` or `codex/`),
  in an isolated worktree when the main checkout has unrelated changes.
  Commit only `designer-docs/` and its evidence; never `.vercel`, `dist`, or
  `node_modules`.
- Dev preview: `npm run dev -- --port 4178` from `designer-docs`. If a branch
  switch blanks the page, restart the preview (with `--force` if Vite's cache
  is stale) and check one fresh load.
- Keep work local during review. After the user approves the full delivery
  flow, carry it through without asking again: merge the reviewed commit to
  local `main`, push `origin main`, deploy that exact revision to Vercel. A
  request limited to a local merge stays local.
- Vercel: reuse `designer-docs/.vercel/project.json` (project
  `coin-designer-docs`; last verified scope `spiefson-7899`). Deploy from
  `designer-docs` with the authenticated CLI and explicit scope. Never relink
  or create another project. Before retrying an interrupted deployment,
  inspect its ID, status, and alias.
- `npm run build` runs during deployment; no extra local pre-release build is
  needed for an unchanged source.
- Once Ready, make one targeted check of <https://coin-designer-docs.vercel.app/>:
  the new guide loads from its route, and one representative interaction works.
  Report the Git push and the deployment separately if either is blocked. End
  with the live guide URL.

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
