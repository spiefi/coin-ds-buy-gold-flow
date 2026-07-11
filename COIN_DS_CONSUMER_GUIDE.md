# Coin DS Consumer Guide

This project uses Coin DS as a consumer. It does not maintain or extend the design system.

## Source of truth

Use these sources in this order:

1. Coin Pattern Library for approved product-level compositions and flows.
2. Coin Components Library for exposed, consumer-facing components and variants.
3. `jfs-components` for React Native implementation details and behavior checks.
4. Coin Subcomponents only to understand component anatomy—not to compose product screens.

## Non-negotiable rules

- Never create, edit, rename, delete, reorganize, bind, or publish variables.
- Do not request access to the variables library for ordinary screen-building work.
- Variables and tokens may be inspected only to understand resolved behavior and existing modes.
- Change appearance only through existing instance properties, component variants, and exposed mode controls.
- Build approximately 99% of product screens from Coin Patterns and Coin Components.
- Do not directly use hidden Coin Subcomponents in product screens.
- Do not detach Coin component or pattern instances.
- Do not recreate a Coin component manually when an approved component or pattern exists.
- Do not modify library architecture, foundations, tokens, or subcomponents.

## Missing capability policy

If a requirement cannot be achieved through the consumer-facing Coin Patterns or Coin Components API, record it as a design-system or documentation gap. Do not bypass the gap with subcomponents, detached instances, or variable edits unless the design-system owner explicitly approves an exception.

## Screen-building workflow

1. Search Coin Pattern Library for a matching flow or composition.
2. Search Coin Components Library for remaining UI needs.
3. Start every product screen from the published Coin `Screen` component. Do not substitute a custom frame for the screen shell.
4. Populate the `Screen` slot with published layout and content instances.
5. Compose vertical page flow with Coin `VStack`; compose horizontal rows with Coin `HStack`; use Coin `Stack` for generic stack/slot composition.
6. Use Coin `Section` and `Hero Section` for content grouping when their semantics match.
7. Place linked instances and configure only their exposed properties, slots, variants, and modes.
8. Use manual frames only when no consumer-facing Coin layout primitive can express the required non-product canvas organization. Manual frames must not replace `Screen`, `Stack`, `VStack`, `HStack`, or `Section` inside product UI.
9. Validate component linkage, slot hierarchy, mode selection, content, spacing, clipping, and typography.
10. Report missing patterns, components, properties, or guidance as onboarding gaps.

## Canonical screen anatomy

The reference screen at `UN7mmMjOojTlV2a4nmnceI`, node `987:4010`, establishes this structure:

```text
Screen
└── Slot
    ├── AppBar
    ├── Hero Section
    │   └── children slot
    │       ├── VStack
    │       │   └── Carousel / other hero content
    │       └── VStack
    │           └── HStack rows
    ├── VStack
    │   └── Section instances
    │       └── Stack
    │           └── content slot
    └── BottomNav
```

The important consumer-level rule is that layout is represented by published Coin instances and populated through slots. Auto-layout behavior inside those components is an implementation detail; consumers compose the instances instead of recreating that layout with custom frames.

## Responsive sizing rules

- Treat responsive resizing as part of component configuration, not a final cleanup step.
- A `Screen` instance should use **Fill container** when it is placed inside a responsive parent layout. A fixed device width may be used only as an explicit preview/breakpoint constraint, never as the sizing rule for the screen's descendants.
- Every direct child inserted into the `Screen` slot should use **Fill container** horizontally unless the component documentation explicitly requires another behavior.
- `VStack`, `HStack`, and `Stack` instances should use **Fill container** on the cross-axis of their parent.
- Every direct child inserted into a `VStack` or `Stack` slot should default to **Fill container** horizontally. Use Hug or Fixed only when the component contract or intended intrinsic control explicitly requires it.
- Full-width action buttons must use Button `Type=Default` and **Fill container**. Do not use `Type=Fixed` for a full-width CTA.
- Never simulate a full-width button by resizing a `Type=Fixed` instance to a pixel width.
- After composing a screen, audit `layoutSizingHorizontal`, component variants, and parent auto-layout context for every direct slot child.

## Current libraries

- Coin Subcomponents: `dSlK8ueQ7wlbyUSZd4f8QO`
- Coin Components Library: `3z7bmhA73Ls7j8Eu4qhYhE`
- Coin Pattern Library: `o5sUMA17UHDkC0C87bFV0l`
- Component package: `jfs-components`
