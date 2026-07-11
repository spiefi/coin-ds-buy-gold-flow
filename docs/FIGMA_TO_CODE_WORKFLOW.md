# Figma-to-Code Workflow

## Purpose

This workflow supports screens created by either a human designer or an AI design agent while preserving human approval gates and Coin DS fidelity.

## Lifecycle

### 1. Screen creation

A designer or AI agent composes screens in Figma using published Coin Patterns and Coin Components. The author follows the Coin consumer rules and does not modify variables.

### 2. Human design review

A human reviewer verifies product intent, content, component selection, responsive structure, and flow coherence. The reviewer resolves genuine design ambiguity before development.

### 3. Ready for dev

The human reviewer marks approved top-level screen frames as **Ready for dev**. This status is the automation gate; unapproved screens must not be implemented automatically.

### 4. Context-package export

The Figma context exporter scans the current page and packages every Ready-for-dev screen in one operation. It must be read-only with respect to the Figma document and all variables.

The package should contain:

- Screen and file metadata
- Layer hierarchy
- Coin component and pattern references
- Instance properties, variants, slots, and selected modes
- Auto-layout, constraints, and Fill/Hug/Fixed behavior
- Text and relevant visual properties
- Referenced raster/vector assets
- A full rendered reference screenshot of each approved screen at its Figma frame dimensions
- Variable bindings and selected mode identifiers/names for interpretation only

The exporter may track previous exports in plugin-local storage. It must not modify screen nodes or variables merely to track export state.

### 5. Codex planning

The primary agent validates the package, identifies shared navigation and state, groups related screens into implementation batches, and records ambiguities. Work begins only when the supplied context is sufficient or remaining assumptions are low-risk and explicit.

Before assigning implementation, the primary agent must create a frozen screen contract containing:

- Exact visible copy and item ordering per screen/state
- Public Coin component mapping for every repeated or composite region
- Exact instance properties, modes, slots, and responsive behavior
- A usable asset manifest containing files, downloadable URLs, or exportable Figma node IDs—not merely generic `Image` layer names
- One reference screenshot for every approved state

If imagery materially affects fidelity and the package does not provide a usable export path, asset extraction is a blocking pre-implementation task. Placeholder artwork must not be treated as an acceptable first implementation unless the user explicitly requests a wireframe.

### 6. Implementation

Implementation agents:

- Use `jfs-components` and existing project patterns
- Preserve Coin component semantics
- Implement responsive layout behavior rather than screenshot-only fixed dimensions
- Reuse shared assets, navigation, state, and utilities
- Use the exported Figma assets for screen-specific imagery instead of placeholders or unrelated component defaults
- Avoid custom substitutes when Coin exposes the required component
- Preserve approved copy and ordering exactly; do not invent product content to complete a component
- Verify composite component behavior before coding. For example, a carousel must contain enough items to reproduce pagination and side peeks, and its initial-state limitations must be documented before implementation
- Capture each implemented state themselves before handing work to independent QA

### 7. Codex QA

Codex captures an implementation screenshot at the same viewport/frame dimensions as the exported Figma reference, then performs structural, visual, responsive, interaction, and accessibility checks using [`CODEX_QA_CHECKLIST.md`](./CODEX_QA_CHECKLIST.md). Failures return to implementation before human QA.

The Figma reference screenshot is QA evidence, not an implementation shortcut. The screen must remain composed from Coin components and real exported image assets rather than being rendered as one flattened screenshot.

A successful typecheck, build, local server response, or navigation test does **not** constitute visual QA. Codex must not claim visual QA passed until every state has a matching-dimension implementation capture and has been compared against its Figma reference. If those captures are missing, the status is **QA incomplete**, not Pass.

When visual QA fails, the failure report becomes the next implementation contract. The primary agent must fix or explicitly disposition every material finding before another Human-QA handoff.

### 8. Human QA

A human reviewer evaluates product intent, cross-screen experience, acceptable visual differences, content, edge cases, and release readiness.

Human QA returns one of:

- **Approved**
- **Changes requested** with screen-specific findings
- **Blocked** with an explicit product/design dependency

Changes requested are implemented and rechecked by Codex before final human approval.

## Suggested statuses

```text
Draft
Design review
Ready for dev
In development
Codex QA failed
Codex QA passed
Human QA
Changes requested
Approved
Delivered
```

## Scaling to many screens

For large batches, the primary agent groups related screens by flow or shared architecture. Implementation and QA can run in parallel, but the primary agent integrates shared concerns and prevents duplication. Human reviewers should receive consolidated QA evidence rather than one unstructured chat per screen.
