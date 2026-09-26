# Badge source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 23 September 2026. `designer-docs/package.json` declares `jfs-components@0.1.60`; the resolved local install is `0.1.60`, and a fresh `npm view jfs-components version` returned registry `latest=0.1.60`. No dependency change was made. The four canonical Storybook docs IDs and their cited stories were confirmed in the published index. All examples use public Coin exports and component-owned modes; the annotation frames and callouts are documentation chrome.

### Badge

- Figma: [Badge master](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=5607-5484), node `5607:5484`, exposes Type Default/Glass, Label, and optional leading slot. Both axes hug content. The solid master owns `Context4=Badge`. The glass master's selected Context4 mode ID did not resolve in the returned live collection even though the package mode list includes `Badge/glass`; full live mode parity is therefore unverified.
- Storybook: [Badge docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-badge--docs) and default, glass, interactive, sizes, and system stories. The installed package accepts label, type, leading, loading, action, modes, and truncation control. Badge Size is Medium/Small; Semantic Intent is Brand/System with separate appearance options and High/Medium/Low emphasis. It renders a supplied leading node verbatim, so the guide passes the same owner mode object to the public Icon and selects the matching `Context4` for Solid or Glass.
- The web GlassFill implementation renders `backdrop-filter`; the local Glass preview on the existing bank photograph had computed `blur(9px)` after Vite selected the `.web` module. No glass overlay or blur override is used. The current Badge implementation ignores its `accessibilityLabel` argument on the rendered wrapper; the interactive example keeps a meaningful visible label. It has no selected or disabled variant.
- The corrected Badge anatomy was reviewed in the local 1095×1080 rendered preview. Three measured, 24px straight leaders point from the left to the leading icon, from above to the label, and from the right to the surface; three equal 20px numbered markers sit beside the instance. The Badge itself retains its natural public size and styling.

### Local visual evidence limit

- The primary reviewer inspected rendered anatomy at 1095×1080 for all four guides. Badge and Checkbox Item use left/top/right short, straight leaders for their three parts. Checkbox uses left Boundary/top Checkmark; Brand Chip uses left Avatar/top Label. Each line and equal numbered marker is positioned from rendered public component bounds. No elbow paths remain in this batch, and no product component was resized or restyled for the diagrams.
- Each guide now shows four standalone Do/Don’t pairs, 16 pairs across the batch. The primary reviewer inspected every rendered pair at 1095×1080. The Brand Chip long-label example deliberately exceeds its 240px dashed host while the full public chip stays visible within the comparison preview; the document did not gain horizontal overflow (`scrollWidth=1095`). The examples use public Coin components and their exposed props, not recreated product UI.
- Before the Do/Don’t expansion, desktop viewport and section captures were inspected for all four guides. At a measured 390px DOM viewport, all four pages had `documentElement.scrollWidth=390`, and the Checkbox long label retained an 18×18px control. The in-app browser returned a malformed narrow screenshot (page content scaled into the upper-left with a large blank area); mobile fit and matching-width screenshot visual QA for the expanded sections remain pending.
