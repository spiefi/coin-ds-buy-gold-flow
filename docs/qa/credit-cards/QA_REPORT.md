# Credit Cards Flow — Codex QA Report

## Scope

- Figma file: `UN7mmMjOojTlV2a4nmnceI`
- Flow section: `996:6107`
- Approved frames: `996:3644`, `996:3823`, `996:4008`, `996:4171`
- Implementation: `src/screens/CreditCardsFlow.tsx`
- Human QA: pending

## Evidence

Each state has a Figma reference in [`reference/`](./reference/) and a rendered implementation capture in [`implementation/`](./implementation/).

| State | Reference | Implementation | Status |
| --- | --- | --- | --- |
| Credit Cards, collapsed | `reference/credit-cards-collapsed.png` | `implementation/credit-cards-collapsed.png` | Warning |
| Credit Cards, expanded | `reference/credit-cards-expanded.png` | `implementation/credit-cards-expanded.png` | Warning |
| Pre-qualified cards | `reference/pre-qualified.png` | `implementation/pre-qualified.png` | Warning |
| Fuel | `reference/fuel.png` | `implementation/fuel.png` | Warning |

## Passed checks

- Public Coin `Screen`, `AppBar`, `HeroSection`, `Carousel`, `ProductMerchandisingCard`, `ListItem`, `IconCapsule`, `CcCard`, `CardCTA`, `BottomNav`, `VStack`, and `HStack` are used.
- The category grid uses controlled Coin `Section.Bento` for collapsed/expanded layout, More/Less behavior, animation, and accessibility state.
- Badge leading icons receive explicit Secondary modes and resolve to Coin purple (`rgb(93, 0, 181)`) in the browser.
- The featured glass badge passes its white icon color explicitly because its slot does not inherit the badge treatment.
- The web preview wraps Coin `Section.Bento` in a controlled 420ms height transition tied directly to its expanded state because the local React Native Reanimated compatibility layer does not execute the native Bento motion.
- Exact approved card names, fee copy, ordering, repeated benefits, nudges, Best-for values, and bottom-nav labels are implemented.
- Required promo, card, Travel-icon, and upgrade-CTA imagery was exported from Figma and added as individual assets.
- Credit-card components use `width="100%"`; screen descendants are not fixed to 360px.
- More, Less, Pre-approved, Fuel, and result Back transitions pass in the browser.
- Browser interaction run completed with zero console errors.
- `npm run typecheck` passes.
- `npm run build` passes.

## Remaining warnings / gaps

1. Coin `Carousel` has no public `initialIndex` or controlled-index prop. The approved Figma state starts on the middle item and shows both left and right peeks. The implementation starts on the configured card and can show only the right peek. This is a Coin component API gap; the component was not bypassed or patched.
2. The collapsed Figma frame is `360×2193`; the stored implementation evidence is the top `360×800` viewport. Its long scroll content was structurally/content checked, but a full-length stitched comparison is still pending.
3. The browser result cards remain slightly taller than the Figma instances because of resolved package typography/list-row metrics. Content and hierarchy match, but the difference should receive Human-QA judgment or a Coin package-token review.
4. Apply, Update, filter, non-arrow category items, bottom navigation, carousel CTA, and the main Back destination remain intentionally undefined because the approved flow supplies no destinations.
5. The production bundle emits Vite's large-chunk advisory. It does not block the preview but should be addressed before using this example as a production application shell.

## QA conclusion

The rebuild is suitable for **Human QA with warnings**. It is not recorded as a pixel-perfect Pass because the Carousel initial-position gap and full collapsed-frame comparison remain unresolved.
