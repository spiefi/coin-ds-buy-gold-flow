# Button, HStack, VStack, Stack, and Breadcrumbs source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

Checked 19 September 2026 for the documentation build in this directory.

## Package versions

- Declared dependency: `jfs-components@0.1.60` in `package.json`.
- Resolved dependency: `jfs-components@0.1.60` in `package-lock.json` and `node_modules`.
- Registry check on 19 September 2026: `npm view jfs-components version --fetch-timeout=12000 --fetch-retries=0` returned `0.1.60`.
- Result: installed and declared versions match the registry `latest`; no upgrade was made.
- The installed package has public `Button`, `HStack`, `VStack`, `Stack`, `Icon`, and `Text` exports. It does not contain a Breadcrumbs component or export.
- The installed package also has public `ActionFooter`, `ActionTile`, `Additem`, `FormUpload`, and `ButtonGroup` exports used by the three action guides.

## Canonical sources

### Figma

- [HStack](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=9243-2201) — public Coin Components Library node `9243:2201`.
- [VStack](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2841-190) — public Coin Components Library node `2841:190`.
- [Breadcrumbs](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=9788-1945) — public Coin Components Library node `9788:1945`.
- [Action Footer](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2904-8057) — public Coin Components Library node `2904:8057`.
- [Action Tile](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1500-13351) — public Coin Components Library node `1500:13351`.
- [Stack anatomy](https://www.figma.com/design/dSlK8ueQ7wlbyUSZd4f8QO/Coin-Subcomponents?node-id=279-3) — Coin Subcomponents node `279:3`; this is an anatomy reference for the Slot, not a recommendation to place hidden subcomponents directly in product screens.

### Storybook

The canonical host is [JFS Components Storybook](https://jfs-components-storybook.vercel.app/). Documentation links use these IDs:

- `components-button--docs`
- `components-hstack--docs`
- `components-vstack--docs`
- `components-stack--docs`
- `components-breadcrumbs--docs`
- `components-actionfooter--docs`
- `components-actiontile--docs`
- `components-additem--docs`

The code-rendered Breadcrumbs references link to these published stories:

- [Default story](https://jfs-components-storybook.vercel.app/iframe.html?id=components-breadcrumbs--default&viewMode=story)
- [Wrapping story](https://jfs-components-storybook.vercel.app/iframe.html?id=components-breadcrumbs--wrapping&viewMode=story)
- [Interactive story](https://jfs-components-storybook.vercel.app/iframe.html?id=components-breadcrumbs--interactive&viewMode=story)

## API and behavior evidence

- **HStack** exposes horizontal direction, cross-axis alignment, horizontal justification, wrapping, reverse visual direction, and token-driven padding/gap. The Figma variant is literally named `Aligment`; `Top Left` is the default and maps to top alignment, while `Left` centers the row. Wrapping needs a constrained width. HStack has no `equalHeight` control.
- **VStack** exposes vertical direction, cross-axis alignment, vertical justification, wrapping, and reverse visual direction with token-driven padding/gap. The inspected Figma source exposes Slot only; it does not expose an Alignment property. Code defaults to stretch. Wrapping needs a constrained height and flows into columns.
- **Stack** exposes direction (`vertical` or `horizontal`, default `vertical`), token Slot gap, and cross-axis flags for equal height in a row or fill width in a column. It has no wrap, reverse, padding, overlap, or automatic viewport direction. A fixed child dimension still wins over a stretch request.
- **Breadcrumbs** orders items from ancestor to current, supplies separators, keeps the last item current unless an explicit current item is provided, and does not auto-collapse a long trail. The guide uses a clearly labelled code-rendered documentation reference built from public leaf primitives, plus a direct link to the published Storybook runtime; it does not claim a local Breadcrumbs package export.

## Known limitations and accessibility evidence

- Breadcrumbs is currently absent from the resolved `jfs-components@0.1.60` package. The reader-facing guide states this package boundary, labels its code-rendered examples as documentation references, and links to the canonical stories for shipped runtime behavior.
- In the inspected Breadcrumbs Storybook iframe, the runtime root is a `div` with an accessible label but no `navigation` role. Ancestor items render as `div` elements with `role=link`; the current item renders `aria-current="page"`. Storybook prose describes a navigation landmark, so the runtime semantics need a source accessibility follow-up. The guide avoids claiming a runtime landmark and keeps this exact discrepancy in this internal report.
- Figma masters for HStack, VStack, and Stack contain empty slots; examples in this site show real public package instances with labelled documentation fixtures to make the layout relationship visible. They are teaching examples, not product-screen fidelity claims.
