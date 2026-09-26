# Attached source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 22 September 2026 for the local Attached, Area Line Chart, Allocation Comparison Chart, and Amount Input guides. Declared and resolved `jfs-components` is `0.1.60`; the registry `latest` check for this session also returned `0.1.60`, so no dependency change was made.

### Attached

- Figma: [Coin Components Library · Attached](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4477-471), node `4477:471`; the inspected source shows a 42px main slot with a 16px attachment reference.
- Storybook: [Attached docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-attached--docs), with the published default, all-positions, square-vs-circular, enforced-image, and capsule-badge stories. The capsule fixture uses public `IconCapsule` children (`ic_cart` main and `ic_rupee` badge), but enlarges them with style dimensions to 56px and 22px. `IconCapsule` resolves its circular radius from the native size before merging a style override, so the guide uses component-owned `Icon Capsule Size=M` (42px) for the main child and `XS` (18px) for the badge, with no width, height, or radius override.
- Public `Attached` exposes `children`, `badge`, nine `position` values, `circular`, `badgeSize`, `badgeRadius`, `modes`, and style. The package clones its owner modes into both slots, waits for layout measurements before placing the badge, and keeps the badge outside the main layout footprint. Runtime source defaults `circular` to `true` while its JSDoc says `false`; the guide follows the runtime default and exposes the choice.
