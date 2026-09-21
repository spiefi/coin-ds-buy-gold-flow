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
