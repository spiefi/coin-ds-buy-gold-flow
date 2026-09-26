# Action Tile source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## ActionTile guide evidence

- Figma public node `1500:13351` exposes `Text` with default `Cards`. The tile is fixed at 168 × 90 with 12px horizontal and 16px vertical padding and an 8px gap.
- Public `ActionTile` accepts `label`, `icon`, `modes`, and optional `onPress`. The supplied icon slot receives the owner’s modes. The guide does not style-patch the fixed dimensions or invent disabled/loading states.
- The live Figma icon capsule was observed resolving `Icon Capsule Size=M`, `AppearanceBrand=Neutral`, `Emphasis=High`, `Semantic Intent=Brand`, `Color Mode=Light`, `Context=Default`, and `Page type=MainPage`. The supplied Storybook reference instead selects Primary appearance with Medium emphasis; the guide follows that reference and passes those owner modes to the icon capsule.
- Canonical story IDs verified in the published index: `components-actiontile--default`, `--with-custom-icon`, and `--with-modes`.
