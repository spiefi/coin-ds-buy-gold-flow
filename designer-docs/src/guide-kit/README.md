# Guide kit

Shared documentation chrome for Coin component guides. A guide supplies copy,
public Coin examples, and playground state. The kit and the page shell supply
everything visual, so every guide looks the same.

**Rule:** a guide adds no CSS. `npm run build` fails if `src/styles.css`
grows or a guide uses bespoke anatomy markup, raw Storybook story URLs, its own
segmented control, or its own route detection. `npm run verify` adds a
headless-browser pass over every guide at 1280 px and 390 px.

## Add a guide

Create one file, `src/guides/<slug>.guide.tsx`. It registers itself: the
navigation, route, and page title come from it. Do not edit App, the
navigation, or `styles.css`.

```tsx
import { Example } from 'jfs-components'
import { ComponentGuideTemplate, type GuideSectionSlots } from '../ComponentGuideTemplate'
import { Anatomy, DoDont, ExampleCard, Segment, Sources, byTestId, docsUrl } from '../guide-kit'
import { defineGuide } from './define'

function ExampleGuide() {
  const sections: GuideSectionSlots = { /* anatomy, configuration, states, sizing,
    content, context, 'dos-donts', sources — every section is required */ }
  return (
    <ComponentGuideTemplate
      metadata={{ slug: 'example', summary: '…', corePrinciple: '…', figmaUrl: '…', storybookUrl: docsUrl('example') }}
      playground={<>{/* .preview-stage + .controls-panel */}</>}
      sections={sections}
    />
  )
}

export default defineGuide({
  slug: 'example',            // must match the file name
  label: 'Example',           // readable name; also the page title
  icon: <path d="…" stroke="currentColor" strokeWidth="1.5" />, // 18×18
  Component: ExampleGuide,
})
```

Reference guide: `src/BadgeGuide.tsx`.

## Anatomy

```tsx
<Anatomy parts={[
  { name: 'Label', note: 'Names the status or category.', target: `${byTestId('x')} [dir="auto"]`, side: 'top' },
  { name: 'Surface', note: 'Groups the message into one shape.', target: byTestId('x'), side: 'right' },
]}>
  <Badge testID="x" … />
</Anatomy>
```

- Render the real public Coin component as the child. Pins, leaders, and the
  numbered legend are drawn for you, and pins stay visible on mobile.
- `target` is a CSS selector inside the specimen. Prefer `byTestId()` on a
  `testID` the component exposes; otherwise use a short structural selector.
- To point at empty space (a gap), use `between: [fromSelector, toSelector]`
  instead of `target`.
- `side` is where the pin sits: `top`, `right`, `bottom`, or `left`. Spread
  parts across sides so leaders stay short. `at` (0–1) moves the landing point
  along the target's facing edge.
- `name` 1–3 words (max 28 characters), `note` one sentence (max 120).
- Small specimens are enlarged automatically (1.5×–3×, labelled "Shown at 2×").
  Use `specimenWidth={300}` for components that fill their host, such as rows.
- Several variants in one diagram: wrap them in `<SpecimenRow>` and
  `<Specimen caption="…">`.
- `surface="dark"` for components designed for dark or media backgrounds.
- `marks` adds measured teaching marks, keyed under the legend automatically:
  `{ kind: 'outline', target, variant: 'bounds' | 'child' }`,
  `{ kind: 'gap', from, to }` (hatched band plus its px size), and
  `{ kind: 'size', target, side, label: 'both' }` (dimension line in real px,
  e.g. "44 × 44"), and `{ kind: 'padding', target }` (inset bands read from
  the element's real padding; it warns if there is none). Keep size marks off
  the sides that carry pins. Add `each: true` to outline every match.
- Measured examples outside the anatomy section (e.g. Sizing) use
  `<Anatomy legend={false} marks={…}>`: a compact stage with marks only.

**Self-check:** in `npm run dev`, Anatomy warns in the console with a
`[guide-kit]` prefix when a target matches nothing, pins overlap or are clipped,
a size label is covered by a pin, or copy is too long. Read all results at once with `window.__guideKit`. An
empty list for every diagram means the anatomy is correct at that width. To
check whole guides at 1280 px and 390 px in one call, run
`await guideKitSurvey(['<slug>'])` on any dev page; `{}` means everything
passed (self-check, pins match legend rows, no horizontal scroll).

## Other components

| Component | Use |
| --- | --- |
| `Sources` | Figma + Storybook cards, story links (`{ label, id }`), and the verification note (`checked="26 September 2026"`, note as children). |
| `storyUrl(id)`, `docsUrl(name)` | Canonical Storybook links. Never paste story URLs. |
| `Segment`, `OnOff`, `Toggle` | Playground controls. |
| `Readout` | A labelled live value under playground controls (`title`, `value`, optional note). |
| `classes` | Joins conditional class names. |
| `ExampleCard` | One example with a title and optional description. |
| `DoDont` | A Do/Don't pair with titles and captions. |

Layout classes already in `styles.css` that guides may use: `preview-stage`,
`stage-label`, `controls-panel`, `text-control`, `coin-new-example-grid`
(`three` for three columns), `coin-new-stack`, `coin-new-row`,
`coin-new-content-list`, `coin-new-host` (`wide`, `narrow`), `coin-new-context`,
`coin-new-readout`.

If a guide needs something the kit lacks, extend the kit once for every guide;
do not add guide-specific CSS.
