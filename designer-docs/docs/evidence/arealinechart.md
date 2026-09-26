# Area Line Chart source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 22 September 2026 for the local Attached, Area Line Chart, Allocation Comparison Chart, and Amount Input guides. Declared and resolved `jfs-components` is `0.1.60`; the registry `latest` check for this session also returned `0.1.60`, so no dependency change was made.

### Area Line Chart

- Figma: [Coin Components Library · Area Line Chart](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4225-1049), node `4225:1049`; the reference was inspected at 320px wide with a 14px y-axis and 298px plot region. The saved review reference is `/tmp/coin-area-figma-sep22.png`.
- Storybook: [Area Line Chart docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-arealinechart--docs), including the default trend, overlap, forecast, and interactive stories. The inspected interactive fixture uses a public x-axis Pressable with keyboard selection in RN Web.
- Public `AreaLineChart` accepts series, x labels, y bounds, curve (`linear` or `monotone`), plot height, grid/axes/legend/dots, projected points, goal pins, active index, callback, and modes. The `AreaLineChart` owner resolves `Appearance / DataViz`, `Emphasis / DataViz`, and `Color Mode`; the guide uses those modes and avoids per-series literal colors. The y domain uses nice ticks, so the guide does not promise exact min/max ticks when bounds are omitted.
- The DOM exposes focusable x-axis targets; canonical IAB accessibility-tree readback omitted those targets and complete series labels. The guide therefore includes a visible plotted-values table as supporting text and does not claim a complete screen-reader chart experience.
- The guide's anatomy callouts measure the rendered y-axis, plot, goal pin, and x-axis label after layout and fonts settle; the leaders and numbered markers are documentation chrome.
- The chart's y-axis labels are absolutely positioned by the shipped component, so the guide reserves external host clearance around chart examples; the deliberately constrained long-label teaching example may still clip inside its own frame.
