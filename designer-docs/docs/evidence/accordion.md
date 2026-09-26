# Accordion source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

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
