# Bottom Nav Item source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 24 September 2026 for the local ButtonGroup, BottomNavItem, and AutoplayControl guides. Declared (`package.json`) and resolved (`package-lock.json`, `node_modules`) `jfs-components` is `0.1.60`. The registry check at 10:16 UTC, `npm view jfs-components version dist-tags`, returned `0.1.60` with `latest: 0.1.60` (registry `time.modified` 2026-07-30). `npm ci` installed the existing lockfile in this worktree; no dependency changed.

Storybook IDs were verified in the published `index.json` (v5, 1,070 entries). Story sources and MDX were read from the published bundle, and the relevant stories were rendered headless for DOM checks. The Figma MCP returned “no edit access” for the Coin Components Library, so the Figma observations below come from the orchestrator’s read of the public nodes and were not re-inspected by the implementation worker. The local Coin catalog snapshot confirms the library assets `Button group` (component), `BottomNavItem` (component set), and `autoplay control` (component set).

### BottomNavItem

- Figma: [BottomNavItem](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=306-92), node `306:92`. A public set with State Idle/Active variants, an icon swap, and a text label; each variant is 31 × 44 with effective Color Mode Light and Brand Jio Finance.
- Storybook: `components-bottomnavitem--docs`; stories `--default`, `--with-custom-icons`, and `--disabled-state`. Composition: `components-bottomnav--docs` with `--default`, `--with-disabled-item`, `--on-dark-background`, and `--mobile-app-simulation`. Its guidance keeps labels to one or two words and the bar to 3–5 items, reserves `accessibilityLabel` for abbreviated labels, and leaves selection to the parent.
- Package: public `BottomNavItem` accepts `iconName` (default `ic_home`), `label` (default `Home`), `modes`, `onPress`, `disabled`, `style`, `labelStyle`, `iconColor`, `iconSize`, accessibility props, and Pressable props. State is not a property. The `BottomNavItem / State` mode (Idle by default, Active) selects the icon and label color tokens. Tokens set a 24 px icon, a 6 px gap, and an 11/14 px label at weight 500. In Light mode, Idle is rgb(48, 51, 56) icon and rgb(36, 38, 43) label; Active is rgb(173, 132, 68) icon and rgb(13, 13, 15) label.
- Public `BottomNav` (`value`, `onChange`, `BottomNav.Item` with `value`) applies the State mode last, so a child cannot override it. It sets `accessibilityState.selected` and gives each item `flex: 1`. The bar is absolutely positioned at the bottom of its nearest positioned ancestor, with 10/23/16 px padding and a 1 px top border.
- Rendered on the web: a standalone Home item is 32 × 44 (Figma 31 × 44) and Finances is 50 × 44. In a 360 px bar, items are 108.7, 81.5, or 65.2 px wide for three, four, or five items. Hover sets opacity 0.85 and takes precedence while the pointer hovers; a press without hover sets 0.7. Disabled sets 0.5, `aria-disabled`, and `tabindex=-1`. Keyboard focus adds a 2 px #222 bottom border beside the browser focus ring, and Enter and Space activate the tab.
- Accessibility: each tab has `role=tab` and an `aria-label` from `accessibilityLabel || label`. React Native Web 0.21 does not emit `aria-selected` from `accessibilityState.selected` (also in published Storybook), and `BottomNav` discards its `accessibilityLabel`, so the tablist is unnamed. An item without `onPress` renders a static, unnamed `role=tab`; an empty label also leaves the tab unnamed, as the guide’s Don’t example verifies.
- Token anomaly: in Dark mode `mode/Grey/400` resolves to rgb(255, 153, 0), so the Idle label turns orange. The guide stays in Light mode, matching the Figma context.

### Verification

- `npm run build` (typecheck and Vite) passed; the chunk-size warning predates this batch.
- Headless Chromium through `playwright-core` 1.56.1 captured desktop (1440 × 900) and narrow-mobile (390 × 844) full frames and per-section frames for all three guides. No page had horizontal overflow and no console errors appeared; the only warning is the Carousel `pointerEvents` deprecation.
- Checked interactions: every playground control; pointer, Enter, and Space activation; disabled items leaving the Tab order; `inert` specimens staying out of focus; measured anatomy after font loading; sidebar and mobile navigation between the new guides, Avatar Group, and Accordion; direct anchor entry; refresh; and Back.
