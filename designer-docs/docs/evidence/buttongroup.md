# Button Group source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 24 September 2026 for the local ButtonGroup, BottomNavItem, and AutoplayControl guides. Declared (`package.json`) and resolved (`package-lock.json`, `node_modules`) `jfs-components` is `0.1.60`. The registry check at 10:16 UTC, `npm view jfs-components version dist-tags`, returned `0.1.60` with `latest: 0.1.60` (registry `time.modified` 2026-07-30). `npm ci` installed the existing lockfile in this worktree; no dependency changed.

Storybook IDs were verified in the published `index.json` (v5, 1,070 entries). Story sources and MDX were read from the published bundle, and the relevant stories were rendered headless for DOM checks. The Figma MCP returned “no edit access” for the Coin Components Library, so the Figma observations below come from the orchestrator’s read of the public nodes and were not re-inspected by the implementation worker. The local Coin catalog snapshot confirms the library assets `Button group` (component), `BottomNavItem` (component set), and `autoplay control` (component set).

### ButtonGroup

- Figma: [Button group](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2018-4119), node `2018:4119`. A 150 × 42 master with an internal Stack and no exposed properties; the sample shows three round icon actions with Button / Size M, Emphasis Medium, AppearanceBrand Primary, and effective Color Mode Light.
- Storybook: `components-buttongroup--docs`; stories `--default` (IconButtons `ic_qr_code`, `ic_photo`, `ic_menu`), `--with-icon-and-buttons` (IconButton `ic_split`, Button Request with AppearanceBrand Secondary, Button Pay with AppearanceBrand Primary), and `--with-modes`. Its docs describe a horizontal row whose `modes` reach every child; the story mode controls use the Button collections.
- Package: public `ButtonGroup` accepts `children`, `modes`, and `style`. It flattens Fragments, clones group modes into every child (a child’s explicit modes win), and renders a centered row with the single-mode tokens `buttonGroup/gap` 12 and `buttonGroup/padding/*` 0. Non-IconButton children receive `flex: 1`. A direct `IconButton` child, checked by element type, keeps its intrinsic size; a wrapper component around it would stretch.
- Rendered on the web: IconButton is 40 × 40 at Button / Size M (padding 11 + icon 18, with its 1 px border inside the box) and 26 × 26 at S and XS. Button is 42 px high at M and 32 px at S. The 150 × 42 Figma sample therefore renders at 144 × 40. “Request” needs a 109 px share at M and 94 px at S, so a 248 px mixed row truncates at M and fits at S. A row that shrinks to its content (Storybook’s mixed story, the guide’s Hug host) gives each Button 90 px and truncates “Request”.
- Storybook discrepancies: `ic_menu` is missing from the 0.1.60 icon registry, so the default story’s third button renders empty and logs a warning. The modes story passes `iconButton/background` as an arg; ButtonGroup does not read it, and the buttons keep their default fill.
- Guide choices: group modes follow the Figma sample; Request uses child AppearanceBrand Secondary as in Storybook; a child Emphasis High override on Pay demonstrates a single emphasized action. Icon actions receive explicit labels (`Scan QR code`, `Add photo`, `Share`, `Split bill`); without one, IconButton derives its name from the icon, such as “Qr Code”. Fixed-width specimens scale down on narrow screens with a visible “Shown at N%” note, and their captions report layout pixels.

### Verification

- `npm run build` (typecheck and Vite) passed; the chunk-size warning predates this batch.
- Headless Chromium through `playwright-core` 1.56.1 captured desktop (1440 × 900) and narrow-mobile (390 × 844) full frames and per-section frames for all three guides. No page had horizontal overflow and no console errors appeared; the only warning is the Carousel `pointerEvents` deprecation.
- Checked interactions: every playground control; pointer, Enter, and Space activation; disabled items leaving the Tab order; `inert` specimens staying out of focus; measured anatomy after font loading; sidebar and mobile navigation between the new guides, Avatar Group, and Accordion; direct anchor entry; refresh; and Back.
