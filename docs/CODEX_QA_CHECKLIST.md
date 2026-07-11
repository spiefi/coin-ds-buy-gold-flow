# Codex QA Checklist

Codex QA is a required preflight before Human QA. It is evidence, not final product approval.

## 1. Context integrity

- [ ] Screen is marked Ready for dev.
- [ ] Figma file key and node ID are recorded.
- [ ] Context export version/timestamp is recorded.
- [ ] Required assets are present and mapped to the correct nodes.
- [ ] The asset manifest is usable: each required asset has a local file, downloadable URL, or exportable Figma node ID.
- [ ] A full Figma reference screenshot exists at the source screen's frame dimensions.
- [ ] Ambiguities and assumptions are documented.
- [ ] Exact visible copy and list ordering have been frozen before implementation.

## 2. Coin structural QA

- [ ] Product screen uses Coin `Screen`.
- [ ] Composition uses appropriate Coin Patterns and public Coin Components.
- [ ] Layout uses `VStack`, `HStack`, `Stack`, `Section`, or other published primitives where applicable.
- [ ] No hidden Coin Subcomponents are used directly.
- [ ] No Coin instances are detached or manually recreated.
- [ ] Component properties, variants, modes, and slots match Figma.
- [ ] Repeated/composite regions have been mapped to their public Coin component before custom layout is considered.
- [ ] Slotted icons and content resolve the intended modes; QA does not assume the host component cascades modes into slots.
- [ ] Expandable action grids use the public semantic pattern (for example `Section.Bento`) when available, even when the source screen was manually composed from rows.
- [ ] Carousel item count, pagination, peeking, and initial state match the approved reference or are recorded as a package/API gap.
- [ ] No variables were modified.
- [ ] Missing capabilities are reported as gaps rather than bypassed.

## 3. Responsive and auto-layout QA

- [ ] Direct screen-slot children Fill container horizontally unless explicitly intrinsic.
- [ ] Stack children follow the intended Fill/Hug/Fixed behavior.
- [ ] Full-width buttons use Button `Type=Default` and Fill container.
- [ ] Fixed pixel widths are limited to explicit breakpoints or intrinsic assets.
- [ ] Text can wrap without clipping or unintended overflow.
- [ ] Layout is checked at relevant narrow and wide preview sizes.
- [ ] Safe areas, scrolling, and bottom actions behave correctly.

## 4. Visual QA

- [ ] Implementation screenshot is compared with the Figma reference.
- [ ] Reference and implementation screenshots use matching viewport/frame dimensions and scale.
- [ ] Content, hierarchy, alignment, spacing, and sizing match.
- [ ] Images, logos, icons, and aspect ratios match.
- [ ] Screen-specific images come from the approved Figma assets; no placeholder or library-default image remains unintentionally.
- [ ] The implementation is not a flattened screenshot of the Figma screen.
- [ ] Typography, color, radius, borders, and elevation are consistent with resolved Coin output.
- [ ] Intentional differences are listed with reasons.
- [ ] Every approved screen/state has its own reference and implementation capture; an overview-flow screenshot does not substitute for them.
- [ ] QA compares exact copy, ordering, component variants, and imagery—not only spacing and colors.
- [ ] No Pass is issued solely from typecheck, build, HTTP response, or successful navigation.

## 5. Interaction QA

- [ ] Navigation paths work in both directions where applicable.
- [ ] Buttons, links, inputs, selectors, and gestures behave as designed.
- [ ] Loading, disabled, error, empty, and success states are covered when specified.
- [ ] Shared state survives navigation as intended.
- [ ] No interaction leads to a blank or unreachable screen.

## 6. Accessibility QA

- [ ] Interactive elements have meaningful accessible names.
- [ ] Decorative images are hidden from assistive technology where appropriate.
- [ ] Reading and focus order follow the visual flow.
- [ ] Touch targets and keyboard interaction are reasonable for the target platform.
- [ ] Text and controls remain usable when content grows.

## 7. Engineering QA

- [ ] Type checking passes.
- [ ] Production build passes.
- [ ] Relevant tests pass.
- [ ] Browser/native preview opens without runtime errors.
- [ ] Console errors are resolved; accepted warnings are documented.
- [ ] No unrelated files or user changes are included.

## Per-screen report

Each screen receives one status:

- **Pass** — ready for Human QA
- **Warning** — usable, but includes a documented difference or risk
- **Fail** — must return to implementation

If either the reference capture or implementation capture is missing, the screen is **QA incomplete** and cannot receive Pass.

The report includes the Figma reference screenshot, matching implementation screenshot, comparison result, checks performed, component structure, differences, and a link or instructions for Human QA.
