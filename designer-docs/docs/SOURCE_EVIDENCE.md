# Designer docs source evidence

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

## ActionFooter guide evidence

- Figma public node `2904:8057` exposes optional `Title`. The inspected 360 × 93 HUG reference uses 10px top, 16px horizontal, and 41px bottom padding with an 8px internal gap; selected modes include `Color Mode=Light`, `context5=Default`, and `Action Footer Radius=False`.
- Public `ActionFooter` accepts `title`, `children`, `modes`, `safeAreaBottom`, and `bottomPadding`. A single public `ButtonGroup`, `Stack`, or `Slot` child owns its internal layout and receives the footer modes. The examples use `ButtonGroup` for horizontal actions and `Stack` for vertical actions.
- The package defaults `bottomPadding` to 24 and optionally adds the native safe-area inset. On web it remains in normal document flow; on native it pins to the bottom of its host. Keyboard avoidance is explicitly consumer-owned.
- Canonical story IDs verified in the published index: `components-actionfooter--default`, `--with-title`, `--bottom-padding-24`, and `--with-stacked-content`.

## ActionTile guide evidence

- Figma public node `1500:13351` exposes `Text` with default `Cards`. The tile is fixed at 168 × 90 with 12px horizontal and 16px vertical padding and an 8px gap.
- Public `ActionTile` accepts `label`, `icon`, `modes`, and optional `onPress`. The supplied icon slot receives the owner’s modes. The guide does not style-patch the fixed dimensions or invent disabled/loading states.
- The live Figma icon capsule was observed resolving `Icon Capsule Size=M`, `AppearanceBrand=Neutral`, `Emphasis=High`, `Semantic Intent=Brand`, `Color Mode=Light`, `Context=Default`, and `Page type=MainPage`. The supplied Storybook reference instead selects Primary appearance with Medium emphasis; the guide follows that reference and passes those owner modes to the icon capsule.
- Canonical story IDs verified in the published index: `components-actiontile--default`, `--with-custom-icon`, and `--with-modes`.

## Additem guide evidence

- `Additem` is a public export within the `FormUpload` family. It owns a fixed 44 × 44 cell and accepts `state` (`empty` or `preview`), `imageSource`, `onPress`, optional `onRemove`, injected `picker` plus `onAssetsPicked`, `modes`, and `isDisabled`.
- The package merges default inner IconCapsule modes `AppearanceBrand=Neutral`, `Emphasis=Low`, and `Icon Capsule Size=S`. `FormUpload` is the public in-context composite for labels, support text, controlled attachments, wrapping, and picker integration.
- The lower-case Additem component key `c56305b04f6636abc27759702a16af895c413b23` was identified in the read-only Coin Subcomponents file `dSlK8ueQ7wlbyUSZd4f8QO`. The available live page context exposed no matching node, so the guide links to the source file and does not guess a node ID.
- Package source renders the preview remove IconCapsule with `onTouchEnd`; IconCapsule intentionally drops its `accessibilityLabel`. In live browser QA at 390 × 844 and desktop width, the preview remained after both a mouse click and Enter on the visible remove button. The button rendered at 29 × 29 without an accessible name inside the labelled 44 × 44 preview. The guide leaves the component internals unchanged.
- Responsive browser QA at 390 × 844 confirmed all three new routes without document overflow: ActionFooter's Coin heading kept normal letter spacing, ActionTile remained 168 × 90, and Additem remained 44 × 44. Button and HStack retained their existing desktop hero typography after the shared selector was narrowed.
- Canonical story IDs verified in the published index: `components-additem--default`, `--preview`, `--preview-with-remove`, `--with-picker`, `--disabled`, and `--all-states`.

## App Bar guide evidence

Checked 21 September 2026 for the local App Bar guide and package version.

### Package and canonical sources

- Declared and resolved package: `jfs-components@0.1.60`.
- Registry check on 21 September 2026: `npm view jfs-components version --fetch-timeout=12000 --fetch-retries=0` returned `0.1.60`; the declared and resolved versions match `latest`, and no dependency change was made.
- Figma: [Coin Components Library · App Bar](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1070-18571), component set node `1070:18571`. The live source exposes `Type` (`MainPage`, `SubPage`) and component properties named `Slot`, `Slot 2`, and `Middle`, with variants `611:94` (MainPage) and `537:5466` (SubPage). The leading mark or back arrow is built into those Figma variants rather than exposed as a Figma leading property. Both variants explicitly own `Context2=AppBar`. The package maps its public slots as `leadingSlot`, `middleSlot`, and `actionsSlot`.
- Storybook inventory: `components-appbar--docs`, `--default`, `--main-page`, `--sub-page`, `--sub-page-long-title`, and `--sub-page-with-linear-progress`. The guide links to the docs page and the published story iframes.

### Public API and behavior

- `AppBar` accepts `type`, `leadingSlot`, `middleSlot`, `middleSlotWidth`, `actionsSlot`, `modes`, `onLeadingPress`, and accessibility props. `MainPage` has no default leading node; `SubPage` supplies a default back NavArrow when `leadingSlot` is omitted.
- The package default `middleSlotWidth` is `192`; the SubPage middle is centered in an absolute overlay with 21px horizontal inner padding and clips overflow. AppBar resolves its own modes with `Context2=AppBar` and cascades the resulting mode object to direct slot children.
- Public `JioDot` is available as a MainPage `leadingSlot` choice and defaults to a 32px token size. Public `IconButton` supports `accessibilityLabel`, `onPress`, and `disabled`; the guide uses it for named back and action controls and shows child enabled/disabled behavior.
- Published App Bar Storybook source `95785.7c1409ae.iframe.bundle.js` defines `TitleText` with the native React Native `Text` primitive, `numberOfLines={1}`, and inline `{ fontSize: 16, fontWeight: 'bold', color: modes?.['Color Mode'] === 'Dark' ? '#FFF' : '#000' }`. The guide reuses that source fixture verbatim for middle slots because the Figma Middle slot `3991:4125` is empty and does not prove a Title child or typography. The literal foreground colors are source provenance, not a Figma token claim or a shipped AppBar patch.
- The same published stories configure SubPage actions with `Emphasis='Low'` and use `ic_hellojio` plus `ic_more_horizontal`; the MainPage story uses leading `JioDot`, no middle title, and `ic_add` plus `Avatar` actions. The guide preserves those public slot configurations while adding accessible labels to its interactive IconButtons.
- The Figma reference measures MainPage at 328 × 68 with 16px padding and SubPage at 328 × 52 with 10px vertical and 16px horizontal padding. The package derives height from resolved padding plus child geometry, so the guide explains the source difference instead of asserting fixed runtime parity.

### Known limitations and accessibility evidence

- Figma MainPage includes the JioDot mark in its inspected reference, while the public package intentionally makes JioDot opt-in through `leadingSlot` for backward compatibility.
- The package's default SubPage `Pressable` sets `accessibilityRole="button"` but passes `accessibilityLabel={undefined}`. The guide supplies a public `IconButton` with `accessibilityLabel="Go back"` for its interactive SubPage examples and leaves the package internals unchanged.
- Long SubPage titles remain constrained by the centered 192px middle box; the guide demonstrates truncation in a narrow host and does not invent responsive hiding, sticky behavior, or collapsed AppBar states.

## AccordionCheckbox guide evidence

Checked 19 September 2026 for the local AccordionCheckbox guide and package version.

### Package and canonical sources

- Declared and resolved package: `jfs-components@0.1.60`.
- Registry check on 19 September 2026: `npm view jfs-components version --fetch-timeout=12000 --fetch-retries=0` returned `0.1.60`; the declared and resolved versions still match `latest`, and no dependency change was made.
- Figma: [Coin Components Library · Accordion / Checkbox](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4005-2906), component set node `4005:2906`. The live top-level source exposes `Title`, `Subtitle`, and `State` (`Idle`, `Hover`, `Open`, `Open Hover`, `Disabled`). The selected checkbox is nested in the header, and the open content is a public Checkbox Group slot. The reference is 445px wide, with a 68px collapsed state and 179px open state, 16px vertical and 12px horizontal container padding, 12px gap, 24px chevron, and 8px content top padding.
- Storybook inventory: `https://jfs-components-storybook.vercel.app/index.json` lists `components-accordioncheckbox--default`, `--expanded`, `--disabled`, `--controlled-select-all`, `--stack`, and `--no-content`. The guide links to the published docs page and the default and controlled-select-all stories.

### Public API and behavior

- `AccordionCheckbox` is exported from the public `jfs-components` barrel. Its props include `title`, `subtitle`, `defaultExpanded`/`expanded` with `onExpandedChange`, `defaultChecked`/`checked` with `onCheckedChange`, `disabled`, `children`, `modes`, `style`, `accessibilityLabel`, and `disableTruncation`.
- `CheckboxGroup` and `CheckboxItem` are public exports used for the content slot. `CheckboxGroup` forwards modes to child items; `AccordionCheckbox` also forwards its modes recursively through the expanded content slot.
- Checked and expanded state are independent. Pressing the checkbox calls the checked callback; pressing the rest of the header calls the expanded callback. The component does not implement select-all behavior for child items. The guide's in-context example wires that relationship explicitly in consumer state.
- The inspected Figma instance resolves `Color Mode=Light`, `AccordionCheckbox / Output=Default`, `CheckboxGroup / Output=Default`, `context 10=Default`, `Profile Card Appearance=Default`, and `Text Appearance=Neutral`. The package's public `Color Mode` collection supports `Light` and `Dark`, so the guide exposes that package-supported switch and forwards the resolved default context through the public `modes` object.

### Known limitations and accessibility evidence

- The package implementation passes `disabled` to the AccordionCheckbox header press target and header Checkbox, but only forwards modes to children. Nested `CheckboxItem`s remain independently configurable; the guide explicitly tells consumers to pass `disabled` to child rows when required.
- Figma includes `Hover` and `Open Hover` states. The inspected package source has no hover-state handler; the React Native Web runtime provides pressed opacity feedback, so the guide's state specimens are configured references and the guide does not simulate hover styling.
- The implementation requests React Native `LayoutAnimation` for the open/close transition. In the local React Native Web preview, expansion changes immediately without a smooth transition. The guide does not add an animation shim or patch the component.
- Keyboard behavior observed on 19 September 2026 with `jfs-components@0.1.60` and React Native Web `0.21.2`: Space on the parent checkbox expanded the header without selecting it; Enter selected the parent and expanded the header through event bubbling; Space on a nested child did not change its checked state; pointer activation worked. This is a demonstrated public-package/runtime limitation; no internal patch is applied.
- The Figma Open example can show a selected parent checkbox while child rows remain idle. This is evidence that selection and expansion are independent, not an implied indeterminate or automatic child-selection state.

### Documentation implementation record

- On 19 September 2026, `src/GuideNavigation.tsx` became the shared source for the component registry, desktop sidebar, mobile component navigation, and section navigation used by Button, AccordionCheckbox, and the layout guides. Active guide links expose `aria-current="page"`; icons are documentation SVG chrome with a fixed nonshrinking box.
- AccordionCheckbox anatomy marks now measure the rendered public component through layout effects and `ResizeObserver`, then clamp numbered markers and leaders inside the live stage. The measurement and leader lines belong to documentation chrome; the public component and its internals are not patched.

## Accordion guide evidence

Checked 21 September 2026 for the local Accordion guide and package version.

### Package and canonical sources

- Declared and resolved package: `jfs-components@0.1.60`.
- Registry check on 21 September 2026: `npm view jfs-components version --fetch-timeout=12000 --fetch-retries=0` returned `0.1.60`; the declared and resolved versions match `latest`, and no dependency change was made.
- Figma: [Coin Components Library · Accordion](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1291-4846), component set node `1291:4846`. The inspected source exposes `Header` text, a `content` `SLOT`, and `State` values `Idle`, `Hover`, `Open`, `Open Hover`, and `Disabled`. The variants are `1291:4847`, `1291:4854`, `1291:4861`, `1291:4867`, and `1291:4873`. The reference header measures 445 × 40 and the open reference measures 445 × 210, including a 170px content reference; these are source measurements, not a package fixed-height promise. The header label resolves to 14px, 700 weight, JioType Var, 20px line height.
- Storybook inventory includes `components-accordion--docs`, `--default`, `--contained`, `--contained-expanded`, `--expanded`, `--disabled`, `--with-list-items`, `--accordion-group`, and `--dark-mode`. The inspected published fixture is [Accordion-Accordion-stories.fb936310.iframe.bundle.js](https://jfs-components-storybook.vercel.app/Accordion-Accordion-stories.fb936310.iframe.bundle.js).

### Public API and behavior

- `Accordion` is exported from the public `jfs-components` barrel. Its supported guide props are `title`, `contained`, `defaultExpanded` or controlled `expanded` with `onExpandedChange`, `disabled`, `children`, `modes`, `style`, `accessibilityLabel`, and `disableTruncation`.
- The package derives `Accordion States` from `expanded`, `disabled`, pointer hover, and `contained`: `Idle`, `Hover`, `Open`, `Open Hover`, or `Disabled`. The guide passes consumer modes and public props only; it does not force that internal state collection or use the developer-only `showHeader`/`showContent` sticky split.
- The published Storybook mode decorator adds `Color Mode` and `AppearanceBrand` to `args.modes` for the Accordion stories. In the resolved 0.1.60 package, `Accordion` owns only the derived `Accordion States` collection and its title, icon, and header-background aliases resolve to the same values for Light and Dark. The guide passes the published public modes; the dark preview retaining black Accordion text on a dark host is a demonstrated package token/resolver limitation, so no literal color or internal state override is applied.
- The default published fixture uses `title="Accordion title"`, `contained={false}`, and a collapsed body. The expanded Light fixture selects `AppearanceBrand=Primary`. The guide exposes Light and Dark through the public mode object and retains the package's token ownership.
- The published list fixture uses public `ListItem` with `layout="Horizontal"`, a title and support text, `IconCapsule` `ic_card` in the leading slot, `MoneyValue` value `500` with currency `₹` in the trailing slot, and `navArrow`. The guide reuses that composition in its account context. The group fixture places `Payment Methods` and `Bank Accounts` siblings with independent expanded state; it does not imply exclusive opening.

### Known limitations and accessibility evidence

- The package derives height from its children and token padding, while the Figma reference supplies a 445px source measurement and a content-driven open example. The sizing examples show a roomy host and a narrow host with a readable wrapped title instead of asserting fixed parity.
- The package requests React Native `LayoutAnimation` during open and close. In the local React Native Web preview, this transition is immediate; the guide leaves the shipped behavior unchanged and does not add an animation shim.
- The package source supplies `accessibilityState={{ expanded: isExpanded, disabled, ...accessibilityState }}` to its header Pressable. In the RNW DOM smoke, the rendered button does not expose an `aria-expanded` attribute even though Enter and Space toggle it correctly; this is recorded as a platform semantic gap and the guide does not patch the component.
- The anatomy leaders and numbered marks measure the rendered public header, label, add/minus icon, content slot, and bottom divider after layout and fonts settle. They are documentation chrome and do not patch Accordion internals.

## Four component batch evidence

Checked 22 September 2026 for the local Attached, Area Line Chart, Allocation Comparison Chart, and Amount Input guides. Declared and resolved `jfs-components` is `0.1.60`; the registry `latest` check for this session also returned `0.1.60`, so no dependency change was made.

### Attached

- Figma: [Coin Components Library · Attached](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4477-471), node `4477:471`; the inspected source shows a 42px main slot with a 16px attachment reference.
- Storybook: [Attached docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-attached--docs), with the published default, all-positions, square-vs-circular, enforced-image, and capsule-badge stories. The capsule fixture uses public `IconCapsule` children (`ic_cart` main and `ic_rupee` badge), but enlarges them with style dimensions to 56px and 22px. `IconCapsule` resolves its circular radius from the native size before merging a style override, so the guide uses component-owned `Icon Capsule Size=M` (42px) for the main child and `XS` (18px) for the badge, with no width, height, or radius override.
- Public `Attached` exposes `children`, `badge`, nine `position` values, `circular`, `badgeSize`, `badgeRadius`, `modes`, and style. The package clones its owner modes into both slots, waits for layout measurements before placing the badge, and keeps the badge outside the main layout footprint. Runtime source defaults `circular` to `true` while its JSDoc says `false`; the guide follows the runtime default and exposes the choice.

### Area Line Chart

- Figma: [Coin Components Library · Area Line Chart](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4225-1049), node `4225:1049`; the reference was inspected at 320px wide with a 14px y-axis and 298px plot region. The saved review reference is `/tmp/coin-area-figma-sep22.png`.
- Storybook: [Area Line Chart docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-arealinechart--docs), including the default trend, overlap, forecast, and interactive stories. The inspected interactive fixture uses a public x-axis Pressable with keyboard selection in RN Web.
- Public `AreaLineChart` accepts series, x labels, y bounds, curve (`linear` or `monotone`), plot height, grid/axes/legend/dots, projected points, goal pins, active index, callback, and modes. The `AreaLineChart` owner resolves `Appearance / DataViz`, `Emphasis / DataViz`, and `Color Mode`; the guide uses those modes and avoids per-series literal colors. The y domain uses nice ticks, so the guide does not promise exact min/max ticks when bounds are omitted.
- The DOM exposes focusable x-axis targets; canonical IAB accessibility-tree readback omitted those targets and complete series labels. The guide therefore includes a visible plotted-values table as supporting text and does not claim a complete screen-reader chart experience.
- The guide's anatomy callouts measure the rendered y-axis, plot, goal pin, and x-axis label after layout and fonts settle; the leaders and numbered markers are documentation chrome.
- The chart's y-axis labels are absolutely positioned by the shipped component, so the guide reserves external host clearance around chart examples; the deliberately constrained long-label teaching example may still clip inside its own frame.

### Allocation Comparison Chart

- Figma: [Coin Components Library · Allocation Comparison Chart](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4976-1080), node `4976:1080`; the inspected reference uses current values 65/25/10 and a 35 baseline marker. The saved review reference is `/tmp/coin-allocation-figma-sep22.png`.
- Storybook: [Allocation Comparison Chart docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-allocationcomparisonchart--docs), including the default and `no-baseline` stories.
- Public `AllocationComparisonChart` accepts data segments, optional baselines, max, height, bar width, legend labels, value formatting, modes, and truncation. The guide uses `Appearance / DataViz`, `Emphasis / DataViz`, and `Color Mode` on the owner and does not pass the story's custom color overrides.
- Source and rendered story behavior caps `overlayHeight` at `min(baselineHeight, barHeight)`. A recommended baseline above the current pillar is therefore visually clipped at the current pillar; the guide records this runtime limitation and does not present the baseline as an independently scaled bar. The chart is static and has no press or selection state.
- The guide's anatomy callouts measure the rendered legend, first current pillar, baseline overlay, marker, and category label after layout; the leaders and numbered markers are documentation chrome.

### Amount Input

- Figma: [Coin Components Library · Amount Input](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2217-6259), node `2217:6259`; the inspected parent owns `Context3=Amount Input` and shows a 56px amount with a 32px currency and a 14px Add note label. The saved review reference is `/tmp/coin-amount-figma-sep22.png`.
- Storybook: [Amount Input docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-amountinput--docs), with default and `custom-slots` fixtures. The default story relies on ambient context and renders smaller typography than the inspected Figma parent.

## Avatar and Avatar Group

Checked 23 September 2026 for the Avatar and Avatar Group guides. The declared and installed package is `jfs-components@0.1.60`. The earlier registry lookup on 23 September returned `0.1.60`; a fresh lookup during recovery failed with `ENOTFOUND registry.npmjs.org`, so current registry `latest` could not be reconfirmed. No dependency change was made.

### Figma and Storybook

- [Avatar Group](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1366-15672) — public Coin Components Library master `1366:15672`. The `Avatars` slot contains nested Avatar instances; its render shows overlapping circular portraits.
- [Avatar](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1-37658) — public master `1:37658`, with Image and Monogram styles and monogram text.
- [Avatar Group Storybook](https://jfs-components-storybook.vercel.app/?path=/docs/components-avatargroup--docs) documents the default, large-size, and custom-gap stories. The custom-gap story exposes `modes` and `style`; it does not expose a gap control.
- [Avatar Storybook](https://jfs-components-storybook.vercel.app/?path=/docs/components-avatar--docs) documents Image, Monogram, sizes, and remote-image examples.

### Public package contract

- `AvatarGroup` is a public default export from the `jfs-components` barrel. Its implementation accepts `modes`, React `children`, and `style` (plus native View props). Figma exposes the Avatar Size mode; it resolves to L 42 px, M 36 px, S 29 px, and XS 14 px. The group derives member count from its children, with no count property. Installed group tokens provide a `-6 px` overlap and `0` padding, with no public gap property. The last child is rendered in front. The implementation cuts out the next circle's area from earlier children with web CSS masks and an SVG native mask.
- `AvatarGroup` clones each child with its modes merged over the group modes. Explicit child modes therefore override the owner mode. Keep child Avatar modes unset when the group should control their common size.
- `Avatar` is a public default export with `style` (`Image` or `Monogram`, default `Image`), `monogram` (default `MS`), `imageSource`, `modes`, `loading`, `onPress`, `disabled`, and View props. Its Avatar Size modes resolve to the same 42/36/29/14 px values. With no `imageSource`, the implementation displays a bundled fallback image; use a supplied person-specific source for identity rather than treating the fallback as a person record.
- `loading` is part of the Avatar type, but in the checked web runtime a direct `loading={true}` outside an active `SkeletonGroup` renders no placeholder: Avatar returns Skeleton, and Skeleton returns `null` when its context is inactive. The guides demonstrate loading through the public `SkeletonGroup`; the group example wraps the full AvatarGroup so child mode cloning still works, then marks only the loading Avatar. This is a limitation of the checked package, not a reason to patch its internals.
- The component type accepts `accessibilityLabel`, but the implementation discards it, hides inner image/text from accessibility, and renders the pressable wrapper with role `image`. The guides do not present it as an accessible action or rely on Avatar to announce its content.
- Public `AmountInput` exposes `moneyValueSlot`, `noteInputSlot`, `modes`, and style. It clones the owner modes into supplied `MoneyValue` and `NoteInput` children and falls back to those public children when slots are falsy. `MoneyValue` owns editable, hidden, focused, currency, and value behavior; `NoteInput` owns its focus and controlled text behavior.
- The `NoteInput` implementation accepts a `state` prop but destructures it without using it; the guide demonstrates focus and filled text rather than a manually selected state. The guide passes `Color Mode=Light` and `Context3=Amount Input` to the owner and does not override child typography or colors.

## Badge, Checkbox Item, Checkbox, and Brand Chip

Checked 23 September 2026. `designer-docs/package.json` declares `jfs-components@0.1.60`; the resolved local install is `0.1.60`, and a fresh `npm view jfs-components version` returned registry `latest=0.1.60`. No dependency change was made. The four canonical Storybook docs IDs and their cited stories were confirmed in the published index. All examples use public Coin exports and component-owned modes; the annotation frames and callouts are documentation chrome.

### Badge

- Figma: [Badge master](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=5607-5484), node `5607:5484`, exposes Type Default/Glass, Label, and optional leading slot. Both axes hug content. The solid master owns `Context4=Badge`. The glass master's selected Context4 mode ID did not resolve in the returned live collection even though the package mode list includes `Badge/glass`; full live mode parity is therefore unverified.
- Storybook: [Badge docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-badge--docs) and default, glass, interactive, sizes, and system stories. The installed package accepts label, type, leading, loading, action, modes, and truncation control. Badge Size is Medium/Small; Semantic Intent is Brand/System with separate appearance options and High/Medium/Low emphasis. It renders a supplied leading node verbatim, so the guide passes the same owner mode object to the public Icon and selects the matching `Context4` for Solid or Glass.
- The web GlassFill implementation renders `backdrop-filter`; the local Glass preview on the existing bank photograph had computed `blur(9px)` after Vite selected the `.web` module. No glass overlay or blur override is used. The current Badge implementation ignores its `accessibilityLabel` argument on the rendered wrapper; the interactive example keeps a meaningful visible label. It has no selected or disabled variant.
- The corrected Badge anatomy was reviewed in the local 1095×1080 rendered preview. Three measured, 24px straight leaders point from the left to the leading icon, from above to the label, and from the right to the surface; three equal 20px numbered markers sit beside the instance. The Badge itself retains its natural public size and styling.

### Checkbox Item

- Figma: [Checkbox Item master](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4303-8392), node `4303:8392`, exposes Control Leading/Trailing, label slot, and optional EndSlot. The reference width is 256px with Hug height; the nested Checkbox is 18px and the end slot is 80px. These are source measurements, not a fixed package row width.
- Storybook: [Checkbox Item docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-checkboxitem--docs) with default, string label, custom slot, end slot, trailing, trailing with end slot, interactive, and long-label stories. The package row fills its host, prefers `children` over legacy `label`, and forwards owner modes to slot children. With Trailing control, the end action appears first and Checkbox last. A string label wraps in the checked implementation; the story name does not establish ellipsis behavior.
- In the local React Native Web preview, clicking the Details Button updated only its documentation status; the row stayed unselected. Clicking the row toggled selection. The row and nested Checkbox both expose checkbox roles, duplicating semantics. The focused row toggled on Enter but did not toggle after both locator Space and native browser `space` key input; this is a package/platform limitation left unpatched. The public action uses Button Size XS through the owner modes to fit the documented 80px slot.

### Checkbox

- Figma: [Checkbox master](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=886-1552), node `886:1552`, has eight source states: Idle, Hover, Focus, Selected, Selected Hover, Focus Selected, Disabled Active, and Disabled. The control master is 18×18px.
- Storybook: [Checkbox docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-checkbox--docs) and default, checked, disabled, all-states, and interactive stories. The public package accepts checked/defaultChecked, onValueChange, disabled, accessibilityLabel, and modes. Hover and focus-visible are internal interaction responses; no state, indeterminate, or size prop is exposed. Its hitSlop calculation aims for a 44px touch region, but a web hit area was not measured.
- The local web control toggled by pointer click and Enter. A focused Checkbox did not toggle after both locator Space and native browser `space` key input in the checked runtime; this is a package/platform interaction defect, not a guide shim. The disabled control exposed `aria-disabled=true`. The guide's visible-name negative example still passes an accessible label, so it demonstrates missing visible context without creating an unnamed control.

### Local visual evidence limit

- The primary reviewer inspected rendered anatomy at 1095×1080 for all four guides. Badge and Checkbox Item use left/top/right short, straight leaders for their three parts. Checkbox uses left Boundary/top Checkmark; Brand Chip uses left Avatar/top Label. Each line and equal numbered marker is positioned from rendered public component bounds. No elbow paths remain in this batch, and no product component was resized or restyled for the diagrams.
- Desktop viewport and section captures were inspected for all four guides. At a measured 390px DOM viewport, all four pages had `documentElement.scrollWidth=390`, and the Checkbox long label retained an 18×18px control. The in-app browser returned a malformed narrow screenshot (page content scaled into the upper-left with a large blank area), so matching-width mobile screenshot visual QA is pending even though DOM fit checks passed.

### Brand Chip

- Figma: [Brand Chip master](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=3994-3252), node `3994:3252`, exposes Label; its sample measures 190×43px and contains an Avatar at S size (29px). No selected, disabled, or semantic variants were observed.
- Storybook: [Brand Chip docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-brandchip--docs) and default, short-label, long-label, monogram-avatar, remote-image, and interactive stories. The package accepts label, imageSource or avatarSlot, optional onPress, modes, accessibilityLabel, and disableTruncation. It hugs content; its label is one line by default and lacks flex shrink, so the guide uses short identifiers rather than promising automatic fit in a narrow host.
- The AB and HB monograms are consumer-supplied public Avatar slots. Brand Chip forwards its modes recursively and defaults the slot Avatar to S; it does not automatically replace a failed image with a monogram. Local interactive click updated the nearby status message. No product styling or fallback behavior was added to the public component.
