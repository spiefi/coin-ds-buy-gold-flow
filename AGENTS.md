# Coin DS Agent Instructions

These instructions apply to every agent working in this repository, including implementation, design, QA, and sub-agents.

## Required reading

Before designing, implementing, or reviewing a screen, read:

1. [`COIN_DS_CONSUMER_GUIDE.md`](./COIN_DS_CONSUMER_GUIDE.md)
2. [`docs/FIGMA_TO_CODE_WORKFLOW.md`](./docs/FIGMA_TO_CODE_WORKFLOW.md)
3. [`docs/CODEX_QA_CHECKLIST.md`](./docs/CODEX_QA_CHECKLIST.md)

When consuming an exported Figma context package, also read:

4. [`docs/FIGMA_CONTEXT_SCHEMA.md`](./docs/FIGMA_CONTEXT_SCHEMA.md)

## Non-negotiable constraints

- Act as a Coin DS consumer, not a design-system builder.
- Never create, edit, rename, delete, reorganize, bind, publish, or otherwise mutate Figma variables.
- Variable bindings and selected modes may be read to understand resolved behavior only.
- Build product UI approximately 99% from published Coin Components and Coin Patterns.
- Do not compose product screens from hidden Coin Subcomponents.
- Do not detach Coin instances or recreate an existing Coin component manually.
- Use exposed component properties, variants, slots, and modes to configure appearance.
- Never hardcode product UI colors. Read the selected/effective mode flow for each Figma component and nested component from Better LLM context, then reproduce it with Coin component modes so fills, labels, icons, borders, and effects resolve from Coin tokens.
- Obtain screen-specific images, logos, illustrations, and other visual assets from Figma when they are part of the approved design. Do not silently substitute placeholder or library-default imagery.
- Do not begin fidelity implementation until required Figma imagery has a usable local file, downloadable URL, or exportable node ID. A layer named `Image` is not an asset handoff.
- Preserve approved product copy and item ordering exactly. Never invent replacement copy merely to populate a component.
- Map repeated and composite Figma regions to public Coin components before implementation. Do not manually recreate a category item, card, carousel, badge, or similar published composition.
- Do not assume modes cascade through arbitrary component slots. Verify slot behavior in the Coin implementation and pass the intended modes directly to slotted icons/content when the host component renders them verbatim.
- Prefer the correct public Coin pattern when an approved screen is visually correct but structurally mis-composed in Figma and the designer explicitly confirms the design-structure mistake. Preserve the visual result and document the structural correction.
- Require a rendered Figma reference screenshot for every Ready-for-dev screen and use it for visual QA after implementation.
- Never report visual QA as passed based only on build success, a running preview, or working navigation. Each state requires a matching-dimension implementation screenshot and direct comparison with its Figma reference.
- Interaction QA must verify motion between states, not only the final collapsed and expanded layouts. On React Native Web, confirm that compatibility shims do not silently reduce Coin animation APIs to immediate state changes.
- Never implement a composed screen as one flattened screenshot. Reference screenshots are QA evidence; only genuine image/illustration nodes are implementation assets.
- Start screens with Coin `Screen`; use Coin `VStack`, `HStack`, `Stack`, and `Section` for layout where applicable.
- Direct children in screen and stack slots default to Fill container horizontally unless the component contract requires Hug or Fixed.
- Full-width CTAs use Button `Type=Default` and Fill container. Do not stretch a fixed button to a pixel width.
- Treat missing capabilities as design-system/documentation gaps. Report them instead of bypassing Coin architecture.
- Never add screen-level CSS, animation wrappers, recreated internals, or behavioral patches to compensate for a public Coin component that does not work as documented. Use the component as shipped, record the failure as a Coin component or platform-integration bug, and escalate it to the design-system team.
- Public component properties, variants, modes, and documented slot configuration are allowed configuration, not custom fixes. Undocumented overrides are not allowed.
- Components resolve their own token values from their own modes. For a component placed in a slot, configure its contextual modes (for example `Icon` with `Context4: 'Badge'` or `Context4: 'Badge/glass'`) instead of hardcoding token-owned values such as icon color.

## Delivery gate

Only screens that have passed human design review and are marked **Ready for dev** may enter the automatic implementation pipeline.

The required lifecycle is:

```text
Designer or AI agent builds in Figma
→ Human design review
→ Human marks Ready for dev
→ Context package export
→ Codex implementation
→ Codex structural, visual, interaction, and accessibility QA
→ Human QA
→ Changes requested or approved
→ Delivery
```

Codex QA is not final approval. Human QA remains mandatory.

## Multi-agent coordination

- The primary agent owns architecture, navigation, shared state, integration, and the final report.
- Group related screens into bounded implementation batches; do not create isolated architecture per screen.
- Implementation agents must follow the required reading and may edit only their assigned scope.
- QA should be independent of implementation when practical.
- QA agents report findings; they do not silently reinterpret the design.
- Shared files and components require coordination through the primary agent.
- Never use multiple agents as a reason to duplicate components, styles, assets, or navigation logic.

## Evidence and handoff

Every implemented batch must include:

- Figma file and node IDs
- Context-package version or export timestamp
- Screens implemented
- Coin components and patterns used
- Assets added or exported
- Figma reference screenshot for each screen
- Implementation screenshot and visual-comparison result
- Validation commands run
- QA status per screen
- Known differences, warnings, and unresolved gaps
- Human-QA status
