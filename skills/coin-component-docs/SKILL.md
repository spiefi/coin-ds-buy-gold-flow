---
name: coin-component-docs
description: Build and revise code-rendered Coin component documentation pages in the Coin Designer Docs website. Use for a new component guide, anatomy illustrations, interactive examples, or documentation improvements in designer-docs. Also use for board-driven requests to check In progress and build documentation. Does not author Figma files or implement product screens.
---

# Coin Component Docs

Build guides for the Coin Designer Docs site (`designer-docs/` in the Coin DS
workspace). The site's own rules live in the repository and are the source of
truth for how pages are built:

- `designer-docs/AGENTS.md` — scope, what to read, rules, verification.
- `designer-docs/src/guide-kit/README.md` — the kit (`Anatomy`, `Sources`,
  `Segment`, `ExampleCard`, `DoDont`) and how to add a guide.

Read those two first. This skill covers who does what, the brief, and delivery.
User instructions take precedence. The skill's source is
`skills/coin-component-docs/` in the Coin DS repository; edit it there and run
`sh skills/install.sh` to update the Claude Code and Codex copies.

## Platform settings

| | Claude Code | Codex |
| --- | --- | --- |
| Invoke | `/coin-component-docs` | `$coin-component-docs` |
| Branch prefix | `claude/` | `codex/` |
| Worker | `coin-docs-worker` agent (Opus, low effort) | `coin_docs_worker` agent (Luna, Max reasoning) |

## Default build request

"Check the In progress column and build documentation" is the complete request:

1. Use the `coin-workflow` MCP to collect eligible In progress tickets for
   Marcin Śpiewak's design documentation ([selection rules](references/release-and-tickets.md#coin-workflow-tickets)).
   Report an unavailable connection before starting.
2. Announce the batch, then build every ticket in board order on one feature
   branch. A blocked ticket is reported and skipped, not stopped on.
3. For each verified guide: add the review link as a work note, complete only
   Marcin's contribution, move the ticket to Review, and re-read it.
4. Report results and review links. After the user approves the release,
   merge to local main and push origin main without asking again at each
   step; CI verifies and deploys to Vercel ([release](references/release-and-tickets.md#release)).

An explicitly named component, batch, model, or lifecycle overrides these
defaults. A request to edit or explain this skill starts no board work.

## Roles

**Planner (you, the primary agent, strongest model).** Owns judgment and copy:

1. Check `jfs-components` declared/installed vs `npm view jfs-components version`.
2. Read the public export and types, the Figma node, and the actual Storybook
   stories. Classify each behavior as designer-configurable, system-driven, or
   developer-only; never merge conflicting sources into an invented contract.
3. Write `designer-docs/docs/evidence/<slug>.md` and the brief
   ([format](references/brief.md)). The brief holds all page copy, every
   example with its one lesson, and the anatomy parts and marks.

**Worker (cheaper model).** Implements one brief in `src/guides/<slug>.guide.tsx`
with the kit only, runs `npm run build` and `npm run test:browser <slug>`, and
reports. It
does not write copy or make component decisions. Give it the brief path and the
two repository docs, not this conversation. One worker per guide; independent
guides can run in parallel because each owns one file.

**Reviewer (the planner again).** Reads the worker's report, runs
`npm run test:browser <slug>`, and looks at one desktop and one 390 px
screenshot of the new page. Returns a short fix list to the same worker, or
approves. Classify every finding as implementation error, brief error, or Coin
component/platform limitation; report limitations instead of working around
them.

Small edits to an existing guide need no worker: the planner edits directly.

## Done means

- `npm run verify` passes: the build (typecheck, guide check) and the headless
  browser test of every guide at 1280 px and 390 px. The browser test is not
  optional; if it cannot run, report that and do not call the work verified.
- The planner has seen the desktop and mobile screenshots.
- Evidence file written; ticket updated if the work is ticket-linked.

Stop when the requested guides, verification, and any authorized release are
complete. Do not repeat passing checks after moving the same source between
branches.
