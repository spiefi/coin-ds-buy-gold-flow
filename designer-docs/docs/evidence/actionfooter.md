# Action Footer source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## ActionFooter guide evidence

- Figma public node `2904:8057` exposes optional `Title`. The inspected 360 × 93 HUG reference uses 10px top, 16px horizontal, and 41px bottom padding with an 8px internal gap; selected modes include `Color Mode=Light`, `context5=Default`, and `Action Footer Radius=False`.
- Public `ActionFooter` accepts `title`, `children`, `modes`, `safeAreaBottom`, and `bottomPadding`. A single public `ButtonGroup`, `Stack`, or `Slot` child owns its internal layout and receives the footer modes. The examples use `ButtonGroup` for horizontal actions and `Stack` for vertical actions.
- The package defaults `bottomPadding` to 24 and optionally adds the native safe-area inset. On web it remains in normal document flow; on native it pins to the bottom of its host. Keyboard avoidance is explicitly consumer-owned.
- Canonical story IDs verified in the published index: `components-actionfooter--default`, `--with-title`, `--bottom-padding-24`, and `--with-stacked-content`.
