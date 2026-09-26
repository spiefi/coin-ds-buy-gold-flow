# Accordion Checkbox source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

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
