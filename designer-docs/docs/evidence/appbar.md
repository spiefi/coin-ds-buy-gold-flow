# App Bar source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

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
