# Zgredek Bank Flow QA Report

## Handoff

- Figma file: `UN7mmMjOojTlV2a4nmnceI` (Zgredek playground)
- Approved flow section: `1012:6259` — Non device binded user
- Screen nodes:
  - `1012:6627` — Explore / Default viewport
  - `1012:6260` — Bank / New user
  - `1012:6331` — Bank / Wallet account branch
  - `1012:6402` — Bank / Found NTB
  - `1012:6927` — Bank / linked Savings Pro
  - `1012:6545` — Wallet detail
  - `1012:6474` — Saving account detail
- Live context and reference export date: 2026-07-11
- Context-package version: unavailable; the supplied pasted context had no schema version, so every screen was re-read from live Figma and captured individually.
- Human design-review / Ready-for-dev confirmation: confirmed by the user on 2026-07-11.

## Screens implemented

| Route | Screen/state | Reference | Implementation | QA status |
| --- | --- | --- | --- | --- |
| `explore` | Explore | `reference/explore-default.png` | `implementation/explore-default.png` | Static visual review ready; full QA remains blocked by the platform gaps below |
| `bank-new-user` | Bank / New user | `reference/bank-no-account-a.png` | `implementation/bank-no-account-a.png` | Static visual review ready; full QA remains blocked by the platform gaps below |
| `bank-wallet-account` | Bank / Wallet account | `reference/bank-no-account-b.png` | `implementation/bank-no-account-b.png` | Structure/copy verified against sibling state and live context; Figma reference PNG is render-corrupted |
| `bank-found-ntb` | Bank / Found NTB | `reference/bank-no-account-compact.png` | `implementation/bank-no-account-compact.png` | Static visual review ready; full QA remains blocked by the platform gaps below |
| `bank-linked` | Bank / linked Savings Pro | `reference/explore-tlp.png` | `implementation/explore-tlp.png` | Static visual review ready; full QA remains blocked by the platform gaps below |
| `wallet` | Wallet detail | `reference/wallet.png` | `implementation/wallet.png` | Static visual review ready; full QA remains blocked by the platform gaps below |
| `saving-account` | Saving account detail | `reference/savings-account.png` | `implementation/savings-account.png` | Static visual review ready; full QA remains blocked by the platform gaps below |

All implementation screenshots use the exact reference dimensions: 360×1025, 360×920, or 360×800.

## Coin components and patterns

- Screen structure: `Screen`, `AppBar`, `HeroSection`, `VStack`, `HStack`, `Stack`, `Section`, `Section.Bento`, `ScrollArea`
- Product compositions: `Carousel`, `ProductMerchandisingCard`, `CcCard`, `PdpCcCard`, `CardCTA`
- Content/actions: `Title`, `ListGroup`, `ListItem`, `Nudge`, `Badge`, `Icon`, `IconCapsule`, `Avatar`, `Balance`, `ExpandableCheckbox`, `ActionFooter`, `Button`, `IconButton`, `BottomNav`

No Coin instances were detached or recreated. No variables were created, edited, renamed, rebound, or otherwise mutated.

## Assets recovered from Figma

- `src/assets/bank-hero.png` — approved Bank/Savings hero photograph
- `src/assets/profile-avatar.png` — approved Explore profile photograph
- `src/assets/wallet-avatar.png` — approved Wallet avatar
- `src/assets/savings-avatar.png` — approved Savings/Savings Pro avatar
- `src/assets/pairing-icon.png` — recovered Figma raster retained for traceability; implementation uses the equivalent public `ic_link` glyph so Tertiary modes can cascade
- `src/assets/success-icon.png` — approved “Good” insight icon
- `src/assets/explore-promo-{1,2,3}.png` — additional approved Explore merchandising exports retained with the handoff
- Reused approved prior-flow exports: Jio logo, Flipkart promo image/avatar, HSBC thumbnail, and upgrade artwork.

## Validation

- `npm run typecheck` — pass
- `npm run build` — pass
- Primary flow — Explore → Bank → linked Savings Pro: pass
- Back navigation — linked → Bank → Explore: pass
- Wallet account → Wallet detail: pass
- Found NTB → Saving account detail: pass
- Consent toggle and Read more / Read less state: pass
- Accessibility names for categories, navigation, product CTAs, back actions, consent, and apply actions: verified
- Exact-dimension implementation evidence: verified as genuine PNGs at 360×1025, 360×920, and 360×800
- Scrolled Wallet Eligibility evidence: `implementation/wallet-eligibility.png` at 360×800
- Runtime renders successfully. React Native Web/public-library warnings are documented below; the production build has an oversized-chunk warning.

## Human-review corrections

The following feedback was addressed on 2026-07-11 and reverified against the affected Figma descendants:

- Wallet/Saving feature support copy now resolves through the nested Neutral text appearance while the leading icons retain Secondary appearance.
- All three Insight rows use the approved Medium `IconCapsule` geometry; the exported colored-success artwork is preserved inside the capsule.
- Eligibility uses the approved `Text Appearance=Neutral`, `Text Sizes=Medium`, and `Weight=Medium` configuration, resolving to JioType Regular 14/16.
- The Bank connect nudge now uses the approved `AppearanceBrand=Tertiary`, producing the light-blue surface and teal Connect action.
- Its leading link glyph is the public Coin `Icon` and receives the same owner mode object, so the Tertiary appearance cascades to the slot exactly as in Storybook.

## Known differences and platform/design-system gaps

1. The Figma carousel shows five pagination indicators while only three merchandising-card nodes are recoverable from the approved section. The implementation retains the configured approved card and the generic side-card treatment needed for five public-Carousel children/indicators. Public Coin has no independent indicator-count property.
2. Public Coin `Carousel` has no `initialIndex` or controlled-index API. Figma shows the completed card with both adjacent peeks while the first indicator is active. The implementation puts the completed card first and therefore cannot reproduce the left peek.
3. The Bank nudge’s owning public `VStack` is configured with `Background=True`, matching the approved Figma stack. In `jfs-components@0.1.28`, `VStack` resolves padding and gap only; it does not resolve or paint a background token, and its generated component-mode contract omits `Background`. No screen-level fill/CSS override was added; this requires a Coin `VStack` fix and package release.
4. Explore’s section arrow is visible in Figma, but the public `Section` only exposes the arrow through a real `onPress` destination. No destination was supplied, so the implementation does not add a no-op handler.
5. The approved legal copy is truncated at “By checking this box, I (a) acknowledge...”. The literal approved text is preserved; expanded terms were not invented.
6. The `bank-no-account-b.png` Figma reference itself contains large black render-corruption regions. That state was verified through its live node context, exact “Wallet account” copy, dimensions, and the valid sibling Bank reference.
7. React Native Web emits public-library token warnings for two missing Product Merchandising Card font-weight keys, deprecated `pointerEvents`/image tint props, and duplicate child keys in public slot-cloning paths. No screen-level patch was added to the shipped components.
8. The repository’s Reanimated web shim reduces timing APIs to immediate state changes. Motion-between-states QA therefore cannot pass even though navigation and final states work. No screen-level animation wrapper was added.

Static visual review can proceed. Full motion QA is not marked passed until the Reanimated limitation is resolved or explicitly accepted.

## Human QA

Pending. Codex QA is evidence for review and is not final approval.
