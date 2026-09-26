# Autoplay Control source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Batch check

Checked 24 September 2026 for the local ButtonGroup, BottomNavItem, and AutoplayControl guides. Declared (`package.json`) and resolved (`package-lock.json`, `node_modules`) `jfs-components` is `0.1.60`. The registry check at 10:16 UTC, `npm view jfs-components version dist-tags`, returned `0.1.60` with `latest: 0.1.60` (registry `time.modified` 2026-07-30). `npm ci` installed the existing lockfile in this worktree; no dependency changed.

Storybook IDs were verified in the published `index.json` (v5, 1,070 entries). Story sources and MDX were read from the published bundle, and the relevant stories were rendered headless for DOM checks. The Figma MCP returned “no edit access” for the Coin Components Library, so the Figma observations below come from the orchestrator’s read of the public nodes and were not re-inspected by the implementation worker. The local Coin catalog snapshot confirms the library assets `Button group` (component), `BottomNavItem` (component set), and `autoplay control` (component set).

### AutoplayControl

- Figma: [autoplay control](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=7522-7658), node `7522:7658`, with state pause/play variants of 36 × 36.
- Storybook: `components-autoplaycontrol--docs`; stories `--default` (pause), `--play`, and `--disabled` (pause, disabled). Context: `components-carousel--numbered` (autoplay at 3000 ms over full-bleed image slides). Its docs ask consumers to always set `accessibilityLabel`, for example “Pause video”, and name video, audio, and slideshow playback as uses.
- Package: public `AutoplayControl` accepts only `state` (`'pause'` by default, or `'play'`), `modes`, `onPress`, `disabled`, and `style`. `pause` renders `ic_pause` and `play` renders `ic_play`, at a hard-coded 24 px. The single-mode `Autoplay Control` collection sets 36 × 36, a circular radius, a white fill, and a black icon, with no Light/Dark difference. Pressing sets opacity 0.7 and disabled sets 0.5 with the `disabled` attribute, `aria-disabled`, and `tabindex=-1`. The component adds no hover style; keyboard focus shows the browser ring; Enter and Space activate the rendered `<button>`.
- Accessibility gap: the component has no `accessibilityLabel` prop, forwards no other props, and its icon has no title, so the rendered button has no accessible name on this site or in published Storybook. The guide does not patch it and reports it as a Coin accessibility gap.
- Carousel: `type="Numbered"` places AutoplayControl and NumberPagination in an overlay 12 px above the bottom, separated by `carouselControl/gap` 8. It passes `state={isPlaying ? 'pause' : 'play'}`; `autoPlay` defaults to false and `autoPlayInterval` to 4000 ms. The guide starts paused. After Play, slide 1 advanced to slide 2 at about 4 seconds with an animated scroll (intermediate offsets were sampled between 0 and 440 px), and Pause held the position. React Native Web logs `props.pointerEvents is deprecated` from the Carousel overlay.
- Guide choices: slides are public Dark-mode `Card`s using copy from the Storybook CTA fixture, with a 188 px minimum height set through Card’s `style` prop to leave room for the overlay. Specimens sit on a dark documentation surface because the white container disappears on white, which the Do & Don’ts demonstrate.

### Verification

- `npm run build` (typecheck and Vite) passed; the chunk-size warning predates this batch.
- Headless Chromium through `playwright-core` 1.56.1 captured desktop (1440 × 900) and narrow-mobile (390 × 844) full frames and per-section frames for all three guides. No page had horizontal overflow and no console errors appeared; the only warning is the Carousel `pointerEvents` deprecation.
- Checked interactions: every playground control; pointer, Enter, and Space activation; disabled items leaving the Tab order; `inert` specimens staying out of focus; measured anatomy after font loading; sidebar and mobile navigation between the new guides, Avatar Group, and Accordion; direct anchor entry; refresh; and Back.
