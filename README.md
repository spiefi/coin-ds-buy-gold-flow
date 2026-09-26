# Coin DS documentation

The Coin DS designer documentation site: one guide per public Coin component,
built with live `jfs-components` examples.

Live: <https://coin-designer-docs.vercel.app>

| Path | Contents |
| --- | --- |
| `designer-docs/` | The documentation site ([README](designer-docs/README.md)). |
| `skills/` | The `coin-component-docs` agent skill for Claude Code and Codex. |
| `.claude/agents/`, `.codex/agents/` | Docs worker agent definitions. |
| `.github/workflows/designer-docs.yml` | Verify and deploy on push to `main`. |

## Working on the site

```sh
cd designer-docs
npm install
npm run dev       # local preview
npm run verify    # build, guide check, headless browser test
```

Push to `main` to release; CI verifies and deploys to Vercel.
