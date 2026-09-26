# Skills

Source of truth for the repository's agent skills. Claude Code and Codex use
identical copies.

| Skill | Purpose |
| --- | --- |
| `coin-component-docs` | Build and revise Coin Designer Docs guides (planner → brief → worker → reviewer). |

Worker agents used by the skill live in `.claude/agents/coin-docs-worker.md`
(Claude Code) and `.codex/agents/coin_docs_worker.toml` (Codex).

After editing a skill here, run:

```sh
sh skills/install.sh
```
