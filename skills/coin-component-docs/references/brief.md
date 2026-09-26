# Guide brief

The planner writes one brief per guide and saves it next to the evidence, as
`designer-docs/docs/evidence/<slug>.brief.md`. It is the worker's only source
for copy and decisions, so every sentence that appears on the page is final
here. Keep it under about 150 lines; facts that support the copy belong in the
evidence file, not the brief.

## Format

```md
# <Display name> brief

slug: <slug> · label: <Display name> · public API: <Export>
figma: <node URL> · storybook: docsUrl('<name>') · stories: <label>=<id>, …
checked: <date> · jfs-components <version> (registry latest <version>)
icon: <one-line description of an 18×18 outline glyph>

## Overview
summary: <one sentence, when to use it>
principle: <one short sentence>
playground: <each control → public prop/mode it drives>; default state; readout text

## Anatomy
specimen: <exact public component + props/modes>; specimenWidth <px> if it fills its host
parts:
1. <Name> — <note ≤ 120 chars> — target: <testID or selector> — side: <top|right|bottom|left>
marks (optional): outline <target> | gap <from> → <to> | size <target> <side> | padding <target>

## Configuration / States / Sizing / Content / In context
For each section: header, title, description, then examples:
- <Example title> — <public props> — lesson: <what the difference shows>

## Do & Don'ts
- Do <title>: <caption> — <config> | Don't <title>: <caption> — <config>

## Sources
note: <verification note for the page; versions, discrepancies, limits>

## Limits
<behaviors the page must not imply; package/Figma/Storybook discrepancies>
```

## Section guidance

| Section | The brief must give |
| --- | --- |
| Overview | Readable name, purpose, principle, a playground whose controls map to real props or modes. |
| Anatomy | A real instance, parts that are real rendered elements (gaps via `between`), marks only where they teach sizing or spacing. |
| Configuration | Only exposed choices, with visibly different results and a reason to choose each. |
| States | Supported states only (selected, expanded, disabled, loading…); no invented variants. |
| Sizing | Realistic host constraints and who owns the size; a measured diagram (`legend={false}`) when numbers help. |
| Content | Short, component-specific guidance shown with real labels. |
| In context | One believable composition of public Coin components, with consumer wiring stated. |
| Do & Don'ts | Pairs that show an observable consequence, not generic advice. |
| Sources | Links, check date, and material limitations. |

If a section genuinely does not apply, say so in the brief and adapt the
section with the smallest honest content; do not pad with generic prose.

## Worker prompt

Send this, filled in, to the worker (see the platform table in `SKILL.md`):

```text
Implement the <Display name> guide in /Users/spiefi/Documents/Coin DS/designer-docs
on branch <prefix>/<branch>.

Read, in order: designer-docs/AGENTS.md, src/guide-kit/README.md,
docs/evidence/<slug>.brief.md. Reference guide: src/BadgeGuide.tsx.

Create src/guides/<slug>.guide.tsx (and nothing else unless the brief says so).
Use the brief's copy verbatim. Do not add CSS or edit the kit, other guides,
navigation, or scripts; report any missing capability instead.

Done when `npm run build` passes and `npm run test:browser <slug>` reports
the guide passing at 1280 and 390 px. While iterating, `await
guideKitSurvey(['<slug>'])` on the dev server (port 4178, your own browser
tab) gives the same Anatomy result instantly. Do not commit.
Report in at most 15 lines: files changed, survey result, anything you could
not map from the brief.
```
