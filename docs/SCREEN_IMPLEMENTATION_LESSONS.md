# Coin Screen Implementation Lessons

This file is durable process memory for Coin screen work. Read it before implementing or reviewing a screen, then append a concise entry after Human QA reveals a reusable lesson. Keep rules evidence-based and remove or revise lessons that later prove false.

## Operating model

### Default: direct mode

- One primary agent owns context review, implementation, verification, and the user feedback loop.
- Do not spawn sub-agents unless the user's opening screen request explicitly enables harness mode.
- Direct mode still requires the full delivery gate: frozen references, public-component mapping, matching-dimension evidence, interaction/accessibility checks, and Human QA.

### Opt-in: harness mode

The user enables harness mode by saying `use harness`, `use sub-agents`, or `use multi-agent orchestration` in the opening screen request.

- Harness is for the first pass: optional mapping agent, bounded implementation agent, and independent read-only QA agent.
- Once the user begins visual QA, stop spawning agents and use the faster user ↔ primary-agent correction loop.
- Rerun delegated QA only when the user explicitly asks for it.
- Harness quality comes from separated responsibilities and fresh evidence, not from the number of agents.

## Durable rules

1. **Freeze the actual screen contract before coding.** Record exact Figma node IDs, dimensions, reference screenshots, copy/order, assets, selected modes, and interactive states. Do not borrow copy or state from a sibling screen.
2. **Use context and pixels together.** Generated context is structural evidence; the rendered Ready-for-dev screenshot is visual evidence. Resolve disagreements explicitly instead of assuming either source is complete.
3. **Mode ownership includes slots.** Configure the public owner first. If a React-node slot is rendered verbatim and modes do not cascade automatically, forward the owner's same mode object to the slotted Coin child. This is not a child override.
4. **A full-frame mismatch is a root-cause signal.** If bottom content is cut off, do not compress arbitrary outer gaps. Trace the earliest width, height, wrap, padding, or mode divergence and correct it through the public API.
5. **Treat carousels as systems.** Verify item width, Section inset, carousel padding, gap, peek, card height, pagination count, active-dot movement, and snap distance together. A duplicate inset can change wrapping, card height, and the whole page length.
6. **A component gap requires proof.** Before reporting a limitation, inspect public props, documented slots/modes, and package source. If a public configuration can reproduce the design, the mismatch is an implementation bug.
7. **Never stop at build success.** Typecheck, build, and navigation do not prove visual fidelity. Capture the exact reference dimensions, compare the complete frame and every region, then exercise interactive state changes.
8. **Human annotations are high-value evidence.** Convert each annotation into an explicit QA gate, fix the owning cause, recapture the affected region and full frame, and report what changed.
9. **Keep evidence canonical.** Commit the Figma reference, final implementation capture, and final QA report. Keep intermediate diagnostic captures local unless they explain a durable unresolved issue.
10. **Publishing access has independent paths.** An invalid `gh` token does not prove Git push or the connected GitHub app is unavailable. Verify the configured Git remote and app permissions before requesting authentication. Never persist credentials in the repository.

## Aha moments — Health Report flow, 2026-07-13

Figma: `UN7mmMjOojTlV2a4nmnceI`, flow `1035:5657`, screens `1035:8931` and `1035:8932`.

### The first QA pass was too narrow

The first pass checked the requested fixes and build output, but accepted visible full-frame mismatches as non-blocking. That allowed clipped actions, missing pagination, incorrect modes, double carousel insets, wrong chart sizing, and incomplete bottom content to survive.

**Lesson:** every QA pass needs a matching-dimension full frame plus a region checklist. A visible fixable difference is blocking even when the build works.

### Several “package gaps” were configuration errors

CardInsight borders, the emergency-progress color, feedback-action placement, the neutral Nudge, the hero-ring color, and carousel width were all available through public Coin contexts, slots, modes, or props.

**Lesson:** inspect the public component API and source before classifying a mismatch as a Coin limitation.

### Nested mode cascade caused a second-order bug

Moving Like/Dislike into the correct `CardCTA` footer slot fixed placement, but the parent later cascaded Secondary modes into the nested icons. Explicitly forwarding the neutral action mode to both `ButtonGroup` and `IconButton` fixed the actual rendered result.

**Lesson:** verify effective modes at the leaf that paints the pixel, especially across React-node slots.

### Carousel geometry affected the whole page

Duplicate horizontal padding narrowed cards, wrapped titles/subtitles, increased card height, changed snap math, and pushed the More section outside the reference frame. Correct public item widths and plot height fixed downstream overflow without screen CSS.

**Lesson:** when a page becomes too tall, find the first wrap or geometry divergence rather than trimming unrelated spacing.

### The fastest correction loop was direct

Independent agents were valuable for the first-pass audit, but repeatedly respawning them during annotated Human QA added latency and cost. The most efficient loop was user screenshot → primary fix → focused recapture → full-frame regression check.

**Lesson:** harness is opt-in and first-pass-only; Human QA debugging is direct unless the user requests delegated re-verification.

### Only proven limitations remain warnings

The missing `AreaLineChart` Y-axis was verified in package source: its RN Web label container has no usable public width control. Carousel pagination labels and the selected S-size touch target are also public-component accessibility gaps.

**Lesson:** document the exact missing public capability and the evidence that proves it; do not hide it with screen-level CSS.

## Closeout checklist for every screen batch

- [ ] Exact Figma file/node IDs and Ready-for-dev status recorded.
- [ ] Reference screenshot exists for every implemented state at its approved dimensions.
- [ ] Copy, order, assets, modes, and interactive states frozen.
- [ ] Repeated/composite regions mapped to public Coin components.
- [ ] Selected and effective modes verified at owning components and slotted leaves.
- [ ] Complete-frame and region-by-region comparison performed.
- [ ] Carousel, navigation, motion, overflow, and responsive behavior exercised.
- [ ] Accessibility names, targets, and runtime warnings inspected.
- [ ] Every difference classified with public-API evidence.
- [ ] Only canonical reference/final evidence selected for commit.
- [ ] Human QA status recorded; Codex QA is not treated as final approval.

## Entry template

```md
## Aha moments — <flow>, <date>

Figma: <file and node IDs>

### <short lesson title>

What happened: <observable failure or success>.

Root cause: <verified cause>.

Durable rule: <one instruction future screen work can apply>.

Evidence: <reference, implementation capture, public API/source, or QA result>.
```
