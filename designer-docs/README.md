# Coin designer documentation

A documentation site for designers. Each guide explains one public Coin
component with live `jfs-components` examples: overview and playground,
anatomy, configuration, states, sizing, content, in-context use, Do & Don'ts,
and sources.

## How the site is built

| Path | Role |
| --- | --- |
| `src/guides/<slug>.guide.tsx` | Registers one guide: slug, label, icon, page component. Navigation (alphabetical), routes (`/?component=<slug>`), and page titles come from these files. |
| `src/guide-kit/` | Shared documentation chrome: `Anatomy`, `Sources`, `Segment`, `ExampleCard`, `DoDont`. Start with its [README](src/guide-kit/README.md). |
| `src/ComponentGuideTemplate.tsx` | The page shell used by guides. |
| `docs/evidence/<slug>.md` | Verified package, Figma, Storybook, API, and accessibility evidence per guide ([index](docs/evidence/README.md)). |
| `scripts/check-guides.mjs` | Guardrails run by `npm run build`. |

Guides use the kit and add no CSS. The build fails if a guide adds CSS, draws
its own anatomy, pastes Storybook story URLs, defines its own segmented
control, or reads the route itself.

## Local development

```sh
npm install
npm run dev
```

In development, each anatomy diagram checks itself and warns in the console
with a `[guide-kit]` prefix; `window.__guideKit` lists every diagram's issues.

## Checks

```sh
npm run verify
```

`verify` runs `build` (typecheck, guide check, Vite build) and then
`test:browser`, which loads every guide in headless Chrome at 1280 px and
390 px. It needs Google Chrome (or `npx playwright-core install chromium`).
Vercel runs only `build`; run `verify` before committing.

## Vercel

The Vercel project uses `designer-docs` as its root directory. `vercel.json`
runs `npm run build` and publishes `dist`.

## Source boundary

Examples use public `jfs-components` exports configured through supported
props, variants, slots, and modes. Documentation chrome (stages, pins, marks,
legends, controls) lives outside the components and never styles them.
Breadcrumbs is not in the released package; its examples are labelled
code-rendered documentation references built from public primitives, with
links to the canonical Storybook stories.
