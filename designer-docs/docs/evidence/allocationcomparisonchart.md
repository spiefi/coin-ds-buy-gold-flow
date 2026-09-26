# Allocation Comparison Chart source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 22 September 2026 for the local Attached, Area Line Chart, Allocation Comparison Chart, and Amount Input guides. Declared and resolved `jfs-components` is `0.1.60`; the registry `latest` check for this session also returned `0.1.60`, so no dependency change was made.

### Allocation Comparison Chart

- Figma: [Coin Components Library · Allocation Comparison Chart](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4976-1080), node `4976:1080`; the inspected reference uses current values 65/25/10 and a 35 baseline marker. The saved review reference is `/tmp/coin-allocation-figma-sep22.png`.
- Storybook: [Allocation Comparison Chart docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-allocationcomparisonchart--docs), including the default and `no-baseline` stories.
- Public `AllocationComparisonChart` accepts data segments, optional baselines, max, height, bar width, legend labels, value formatting, modes, and truncation. The guide uses `Appearance / DataViz`, `Emphasis / DataViz`, and `Color Mode` on the owner and does not pass the story's custom color overrides.
- Source and rendered story behavior caps `overlayHeight` at `min(baselineHeight, barHeight)`. A recommended baseline above the current pillar is therefore visually clipped at the current pillar; the guide records this runtime limitation and does not present the baseline as an independently scaled bar. The chart is static and has no press or selection state.
- The guide's anatomy callouts measure the rendered legend, first current pillar, baseline overlay, marker, and category label after layout; the leaders and numbered markers are documentation chrome.
