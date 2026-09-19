# Designer docs source evidence

Checked 19 September 2026 for the documentation build in this directory.

## Package versions

- Declared dependency: `jfs-components@0.1.60` in `package.json`.
- Resolved dependency: `jfs-components@0.1.60` in `package-lock.json` and `node_modules`.
- Registry check on 19 September 2026: `npm view jfs-components version --fetch-timeout=12000 --fetch-retries=0` returned `0.1.60`.
- Result: installed and declared versions match the registry `latest`; no upgrade was made.
- The installed package has public `Button`, `HStack`, `VStack`, `Stack`, `Icon`, and `Text` exports. It does not contain a Breadcrumbs component or export.

## Canonical sources

### Figma

- [HStack](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=9243-2201) — public Coin Components Library node `9243:2201`.
- [VStack](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2841-190) — public Coin Components Library node `2841:190`.
- [Breadcrumbs](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=9788-1945) — public Coin Components Library node `9788:1945`.
- [Stack anatomy](https://www.figma.com/design/dSlK8ueQ7wlbyUSZd4f8QO/Coin-Subcomponents?node-id=279-3) — Coin Subcomponents node `279:3`; this is an anatomy reference for the Slot, not a recommendation to place hidden subcomponents directly in product screens.

### Storybook

The canonical host is [JFS Components Storybook](https://jfs-components-storybook.vercel.app/). Documentation links use these IDs:

- `components-button--docs`
- `components-hstack--docs`
- `components-vstack--docs`
- `components-stack--docs`
- `components-breadcrumbs--docs`

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
