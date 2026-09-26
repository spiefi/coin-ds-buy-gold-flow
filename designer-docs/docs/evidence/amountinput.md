# Amount Input source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 22 September 2026 for the local Attached, Area Line Chart, Allocation Comparison Chart, and Amount Input guides. Declared and resolved `jfs-components` is `0.1.60`; the registry `latest` check for this session also returned `0.1.60`, so no dependency change was made.

### Amount Input

- Figma: [Coin Components Library · Amount Input](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2217-6259), node `2217:6259`; the inspected parent owns `Context3=Amount Input` and shows a 56px amount with a 32px currency and a 14px Add note label. The saved review reference is `/tmp/coin-amount-figma-sep22.png`.
- Storybook: [Amount Input docs](https://jfs-components-storybook.vercel.app/?path=/docs/components-amountinput--docs), with default and `custom-slots` fixtures. The default story relies on ambient context and renders smaller typography than the inspected Figma parent.
