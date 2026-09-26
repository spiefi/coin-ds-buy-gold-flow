# Brand Chip source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 23 September 2026. `designer-docs/package.json` declares `jfs-components@0.1.60`; the resolved local install is `0.1.60`, and a fresh `npm view jfs-components version` returned registry `latest=0.1.60`. No dependency change was made. The four canonical Storybook docs IDs and their cited stories were confirmed in the published index. All examples use public Coin exports and component-owned modes; the annotation frames and callouts are documentation chrome.

### Brand Chip

- Figma: [Brand Chip master](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=3994-3252), node `3994:3252`, exposes Label; its sample measures 190×43px and contains an Avatar at S size (29px). No selected, disabled, or semantic variants were observed.
- Storybook: [Brand Chip docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-brandchip--docs) and default, short-label, long-label, monogram-avatar, remote-image, and interactive stories. The package accepts label, imageSource or avatarSlot, optional onPress, modes, accessibilityLabel, and disableTruncation. It hugs content; its label is one line by default and lacks flex shrink, so the guide uses short identifiers rather than promising automatic fit in a narrow host.
- The AB and HB monograms are consumer-supplied public Avatar slots. Brand Chip forwards its modes recursively and defaults the slot Avatar to S; it does not automatically replace a failed image with a monogram. Local interactive click updated the nearby status message. No product styling or fallback behavior was added to the public component.

### Local visual evidence limit

- The primary reviewer inspected rendered anatomy at 1095×1080 for all four guides. Badge and Checkbox Item use left/top/right short, straight leaders for their three parts. Checkbox uses left Boundary/top Checkmark; Brand Chip uses left Avatar/top Label. Each line and equal numbered marker is positioned from rendered public component bounds. No elbow paths remain in this batch, and no product component was resized or restyled for the diagrams.
- Each guide now shows four standalone Do/Don’t pairs, 16 pairs across the batch. The primary reviewer inspected every rendered pair at 1095×1080. The Brand Chip long-label example deliberately exceeds its 240px dashed host while the full public chip stays visible within the comparison preview; the document did not gain horizontal overflow (`scrollWidth=1095`). The examples use public Coin components and their exposed props, not recreated product UI.
- Before the Do/Don’t expansion, desktop viewport and section captures were inspected for all four guides. At a measured 390px DOM viewport, all four pages had `documentElement.scrollWidth=390`, and the Checkbox long label retained an 18×18px control. The in-app browser returned a malformed narrow screenshot (page content scaled into the upper-left with a large blank area); mobile fit and matching-width screenshot visual QA for the expanded sections remain pending.
