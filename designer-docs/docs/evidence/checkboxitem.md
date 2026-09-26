# Checkbox Item source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 23 September 2026. `designer-docs/package.json` declares `jfs-components@0.1.60`; the resolved local install is `0.1.60`, and a fresh `npm view jfs-components version` returned registry `latest=0.1.60`. No dependency change was made. The four canonical Storybook docs IDs and their cited stories were confirmed in the published index. All examples use public Coin exports and component-owned modes; the annotation frames and callouts are documentation chrome.

### Checkbox Item

- Figma: [Checkbox Item master](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4303-8392), node `4303:8392`, exposes Control Leading/Trailing, label slot, and optional EndSlot. The reference width is 256px with Hug height; the nested Checkbox is 18px and the end slot is 80px. These are source measurements, not a fixed package row width.
- Storybook: [Checkbox Item docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-checkboxitem--docs) with default, string label, custom slot, end slot, trailing, trailing with end slot, interactive, and long-label stories. The package row fills its host, prefers `children` over legacy `label`, and forwards owner modes to slot children. With Trailing control, the end action appears first and Checkbox last. A string label wraps in the checked implementation; the story name does not establish ellipsis behavior.
- In the local React Native Web preview, clicking the Details Button updated only its documentation status; the row stayed unselected. Clicking the row toggled selection. The row and nested Checkbox both expose checkbox roles, duplicating semantics. The focused row toggled on Enter but did not toggle after both locator Space and native browser `space` key input; this is a package/platform limitation left unpatched. The public action uses Button Size XS through the owner modes to fit the documented 80px slot.

### Local visual evidence limit

- The primary reviewer inspected rendered anatomy at 1095×1080 for all four guides. Badge and Checkbox Item use left/top/right short, straight leaders for their three parts. Checkbox uses left Boundary/top Checkmark; Brand Chip uses left Avatar/top Label. Each line and equal numbered marker is positioned from rendered public component bounds. No elbow paths remain in this batch, and no product component was resized or restyled for the diagrams.
- Each guide now shows four standalone Do/Don’t pairs, 16 pairs across the batch. The primary reviewer inspected every rendered pair at 1095×1080. The Brand Chip long-label example deliberately exceeds its 240px dashed host while the full public chip stays visible within the comparison preview; the document did not gain horizontal overflow (`scrollWidth=1095`). The examples use public Coin components and their exposed props, not recreated product UI.
- Before the Do/Don’t expansion, desktop viewport and section captures were inspected for all four guides. At a measured 390px DOM viewport, all four pages had `documentElement.scrollWidth=390`, and the Checkbox long label retained an 18×18px control. The in-app browser returned a malformed narrow screenshot (page content scaled into the upper-left with a large blank area); mobile fit and matching-width screenshot visual QA for the expanded sections remain pending.
