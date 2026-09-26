# Coin designer docs — agent instructions

This directory is the Coin designer documentation site. It documents public
Coin components for designers.

## Coin rules

- Use public `jfs-components` exports only, configured through supported
  props, variants, slots, and modes. Never detach, patch internals, recreate a
  Coin component, or hardcode product colors.
- When a slot receives a Coin child and the owner does not propagate modes,
  pass the owner's same mode object to the child.
- Before revising a guide, compare the declared/installed `jfs-components`
  version with `npm view jfs-components version`. Upgrade only with the
  user's authorization. Report missing capabilities as Coin gaps (a ticket on
  the Coin Workflow board), never work around them.
- Figma is read-only reference: the Coin Components Library for public
  properties, variants, slots, and modes; Coin Subcomponents only to
  understand anatomy.

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

- `npm run verify` is required before anything is committed. It runs the
  build (typecheck, guide check, Vite build) and then `npm run test:browser`,
  which loads every guide in headless Chrome at 1280 px and 390 px and fails
  on render errors, title/navigation mismatches, Anatomy self-check issues,
  pin/legend mismatches, horizontal scroll, or runtime errors.
  `npm run test:browser <slug>` checks selected guides on its own private
  build, so parallel workers can run it at the same time.
- While iterating on the dev server (`npm run dev -- --port 4178`),
  `await guideKitSurvey(['<slug>'])` on any page gives the same Anatomy
  result instantly; `{}` means it passes.
- For final review, one desktop and one 390 px screenshot of the changed
  sections. Do not screenshot to debug what the tests already report.
