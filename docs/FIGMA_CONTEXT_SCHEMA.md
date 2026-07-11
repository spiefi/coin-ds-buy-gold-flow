# Figma Context Package Schema

## Goal

The context package gives Codex stable, machine-readable design information for every human-approved screen without requiring a manual copy operation per screen.

## Package layout

```text
codex-package/
├── manifest.json
├── coin-context.json
├── screens/
│   ├── screen-987-1853.json
│   └── screen-987-4010.json
├── references/
│   ├── screen-987-1853.png
│   └── screen-987-4010.png
└── assets/
    ├── gold-coin.png
    └── jio-logo.png
```

## Manifest

```json
{
  "schemaVersion": "1.0",
  "figmaFileKey": "UN7mmMjOojTlV2a4nmnceI",
  "figmaFileName": "Zgredek playground",
  "pageId": "987:0",
  "exportedAt": "2026-07-11T12:00:00Z",
  "exporterVersion": "0.1.0",
  "screens": [
    {
      "id": "987:1853",
      "name": "Buy gold",
      "devStatus": "READY_FOR_DEV",
      "contextFile": "screens/screen-987-1853.json",
      "referenceImage": {
        "path": "references/screen-987-1853.png",
        "width": 360,
        "height": 800,
        "scale": 1
      },
      "assetIds": ["asset-gold-coin", "asset-jio-logo"]
    }
  ]
}
```

## Screen context

Each screen record should include:

```json
{
  "id": "987:1853",
  "name": "Buy gold",
  "type": "INSTANCE",
  "component": {
    "name": "Screen",
    "key": "stable-component-key",
    "sourceFileKey": "coin-library-file-key"
  },
  "componentProperties": {
    "Page type": { "type": "VARIANT", "value": "SubPage" },
    "Color Mode": { "type": "VARIANT", "value": "Light" }
  },
  "selectedModes": {
    "Color Mode": "Light",
    "Context4": "Badge/glass"
  },
  "effectiveModes": {
    "Color Mode": { "value": "Light", "sourceNodeId": "987:1853" },
    "Context4": { "value": "Badge/glass", "sourceNodeId": "987:1901" }
  },
  "layout": {
    "mode": "VERTICAL",
    "horizontalSizing": "FIXED",
    "verticalSizing": "FIXED",
    "padding": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
    "itemSpacing": 0
  },
  "explicitVariableModes": {},
  "boundVariables": {},
  "children": []
}
```

## Required node fields

- Stable node ID, name, type, visibility, and parent/child ordering
- Component key, component name, source library, and instance relationship
- Component properties and property definitions when available
- Text content and text behavior
- Auto-layout direction, padding, spacing, wrapping, alignment, and sizing
- Fill/Hug/Fixed behavior on both axes
- Constraints, bounds, clipping, opacity, fills, strokes, effects, and radii where relevant
- Explicit variable modes and variable bindings for read-only interpretation
- Selected modes on every component instance, including nested instances and slotted components
- Effective/inherited mode flow for every component instance, with the source node for each resolved mode, so implementation never has to infer or hardcode token-owned appearance
- Export settings and asset references
- Override information needed to distinguish defaults from screen-specific decisions

## Coin context

`coin-context.json` maps Figma components to code and consumer rules:

```json
{
  "components": {
    "stable-component-key": {
      "figmaName": "Button",
      "codeImport": "jfs-components/src/components/Button/Button",
      "public": true,
      "defaultHorizontalSizing": "FILL",
      "propertyMap": {
        "Type": "type",
        "Label": "label"
      }
    }
  }
}
```

Subcomponents must be marked `public: false` so implementation agents can understand anatomy without importing them into product screens.

Better LLM context is authoritative for mode flow. The exporter must preserve the selected and effective modes for the complete instance tree—not only the top-level component—because each nested Coin component resolves its own tokens. For example, a glass Badge and its slotted Icon must expose `Context4: Badge/glass`; implementation then passes that mode to the Icon instead of assigning a literal white color.

## Asset rules

- Preserve original aspect ratio and transparency.
- Use deterministic filenames and stable asset IDs.
- Record the originating node ID, export format, scale, and checksum.
- Do not export duplicates when several screens reference the same source.
- Do not embed private access tokens or temporary authenticated Figma URLs.

## Reference screenshot rules

Every Ready-for-dev screen must include a rendered Figma reference screenshot.

- Export the entire top-level screen frame, not a cropped selection of individual layers.
- Record the source node ID, frame width, frame height, export scale, format, and checksum.
- Use a deterministic filename tied to the screen node ID.
- Preserve the source frame's current approved visual state, including resolved component props, modes, imagery, and text.
- Do not use the reference screenshot as an implementation asset.
- After implementation, capture a screenshot at the same viewport/frame dimensions for comparison.
- Store comparison metadata and any accepted differences in the Codex QA report.

The context therefore contains two different image categories:

1. **Implementation assets** — genuine logos, photos, illustrations, and raster/vector image nodes used by the coded screen.
2. **Reference screenshots** — flattened whole-screen renders used only to verify the coded result visually.

## Safety

The exporter is read-only. It may read variable bindings and modes, but it must never create, edit, bind, rename, delete, reorganize, or publish variables. Export tracking belongs in plugin-local storage or the generated package, not in the Figma document.
