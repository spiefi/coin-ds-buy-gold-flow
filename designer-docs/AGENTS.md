# Coin designer docs — agent instructions

This directory is the Coin designer documentation site. It documents public
Coin components; it is not a product screen.

## What applies from the repository root

Does **not** apply here: the root "Required reading" list, Coin Rebuild mode,
Figma context packages, the Ready-for-dev delivery gate, and the screen
evidence/handoff format. Do not read those documents for docs work.

Still applies:

- Use public `jfs-components` exports only, configured through supported
  props, variants, slots, and modes. Never detach, patch internals, recreate a
  Coin component, or hardcode product colors.
- When a slot receives a Coin child and the owner does not propagate modes,
  pass the owner's same mode object to the child.
- Before revising a guide, compare the declared/installed `jfs-components`
  version with `npm view jfs-components version`. Upgrade only with the
  user's authorization. Report missing capabilities as Coin gaps.
- The root GitHub publishing rules.

## Read only what the task needs

1. `src/guide-kit/README.md` — the kit and how to add a guide.
2. The guide file you are working on (reference guide: `src/BadgeGuide.tsx`).
3. `docs/evidence/<slug>.md` for that component.

Do not read other guides or `src/styles.css` unless the task is about them.

## Rules

- A guide adds no CSS and uses the kit: `<Anatomy>` for anatomy (and
  `legend={false}` for measured Sizing diagrams), `<Sources>` for sources,
  `Segment` for controls. `npm run build` enforces this.
- Copy comes from the brief or the existing page. Anatomy part names are 1–3
  words (≤ 28 characters); notes are one sentence (≤ 120).
- Keep verified facts in `docs/evidence/<slug>.md`, not in page copy.

## Verify

- `npm run build` (typecheck, guide check, Vite build).
- Dev server: `npm run dev -- --port 4178`. On any page run
  `await guideKitSurvey(['<slug>'])`; `{}` means the guide passed at 1280 px
  and 390 px.
- For final review, one desktop and one 390 px screenshot of the changed
  sections. Do not screenshot to debug what the survey already reports.
