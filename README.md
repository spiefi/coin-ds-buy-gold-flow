# Coin DS Screen Examples

A React Native Web preview project for implementing approved Figma flows with public Coin components from [`jfs-components`](https://www.npmjs.com/package/jfs-components).

## Current preview

- Credit Cards with collapsed and expanded categories
- Pre-qualified credit-card results
- Fuel credit-card results

The earlier Buy Gold example screens remain in the project but are not the current preview entry point.

## Run locally

```bash
npm install
npm run dev
```

For the production-equivalent local preview used during QA:

```bash
npm run build
npm run preview
```

## Production build

```bash
npm run build
```

The live preview is deployed automatically through GitHub Pages.

## Agent and workflow documentation

- [`AGENTS.md`](./AGENTS.md) — mandatory instructions for all Codex agents and sub-agents
- [`COIN_DS_CONSUMER_GUIDE.md`](./COIN_DS_CONSUMER_GUIDE.md) — Coin DS consumer rules
- [`docs/FIGMA_TO_CODE_WORKFLOW.md`](./docs/FIGMA_TO_CODE_WORKFLOW.md) — Ready-for-dev through Human-QA lifecycle
- [`docs/CODEX_QA_CHECKLIST.md`](./docs/CODEX_QA_CHECKLIST.md) — automated preflight before Human QA
- [`docs/FIGMA_CONTEXT_SCHEMA.md`](./docs/FIGMA_CONTEXT_SCHEMA.md) — proposed batch context-package contract
