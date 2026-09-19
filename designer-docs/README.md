# Coin designer documentation

An isolated documentation site for designers. The site covers the public Coin
Button, Accordion Checkbox, HStack, VStack, and Stack guides, plus a
Breadcrumbs guide with code-rendered documentation references and links to the
published Storybook stories.

## Guides

The component switcher is available in the desktop sidebar and the mobile
header. Direct routes are:

- `/#overview` — Button
- `/?component=accordioncheckbox#overview` — Accordion Checkbox
- `/?component=hstack#overview` — HStack
- `/?component=vstack#overview` — VStack
- `/?component=stack#overview` — Stack
- `/?component=breadcrumbs#overview` — Breadcrumbs

The shared component registry lives in `src/GuideNavigation.tsx` and drives
both menus, their icons, active-page semantics, and section links. To add a
future guide, add one registry item there and add its route dispatch in
`src/App.tsx`; page shells should continue to use the shared navigation
components.

## Local development

```sh
npm install
npm run dev
```

## Checks

```sh
npm run typecheck
npm run build
```

The implementation uses `jfs-components@0.1.60`, which matches the npm
registry's current `latest` release as checked on 15 September 2026. No
dependency upgrade is required for these guides.

## Vercel

Create a Vercel project with `designer-docs` as its root directory. The checked
in `vercel.json` uses `npm run build` and publishes `dist`. No deployment is
performed by this repository setup.

## Source boundary

Product examples import the public `Button`, `AccordionCheckbox`,
`CheckboxGroup`, `CheckboxItem`, `HStack`, `VStack`, and `Stack` exports from
`jfs-components@0.1.60`. The Accordion Checkbox guide keeps selection and
expansion independent and wires any select-all relationship in consumer state.
Breadcrumbs is not included in that released package, so its examples are clearly labelled code-rendered
documentation references built from public leaf primitives, with links to the
canonical published Storybook stories. Documentation controls, callouts,
labels, and fixture shells use semantic HTML and are clearly separated from
the component examples.

The exact package, Figma, Storybook, API, and accessibility evidence is kept in
[`docs/SOURCE_EVIDENCE.md`](docs/SOURCE_EVIDENCE.md).
