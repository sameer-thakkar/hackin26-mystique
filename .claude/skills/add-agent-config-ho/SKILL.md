---
name: add-agent-config
description: Add configuration structure for a new AI coding agent tool
allowed-tools: [Bash, Read, Write, WebFetch, Glob]
---

# Add Agent Config

Add configuration support for a new AI coding agent tool to HeadoutAgentsConfig.

## When to Use

- "Add support for [tool name]" / "Set up [tool name] config"
- "Add [Windsurf/Aider/Codex/etc] configuration" / "Next tool: [tool name]"

## Workflow

### Step 1: Research Official Docs

Before creating files, WebFetch official documentation:
- Directory structure and file locations
- Config file formats (JSON, YAML, Markdown, TOML)
- Supported features (rules, skills, hooks, agents, MCP)
- Priority/hierarchy order
- Cross-tool compatibility

### Step 2: Configuration Components Summary

**CRITICAL**: Create quick-glance summary table at TOP of documentation.

**MUST use ASCII box-drawing characters** for ALL tables:

```
## Configuration Components

\`\`\`
┌──────────────┬───────────┬─────────────────────────────────────────┬────────────────────┐
│ Component    │ Supported │ Location                                │ Format             │
├──────────────┼───────────┼─────────────────────────────────────────┼────────────────────┤
│ Instructions │     ✅    │ AGENTS.md, .tool/rules/                 │ Markdown           │
│ Config       │     ✅    │ .tool/settings.json                     │ JSON               │
│ Rules        │     ⛔    │ -                                       │ -                  │
│ Skills       │     ✅    │ .tool/skills/                           │ Folder + SKILL.md  │
│ Hooks        │     ⛔    │ -                                       │ -                  │
│ Subagents    │     ⛔    │ -                                       │ -                  │
│ MCP          │     ✅    │ .tool/mcp.json                          │ JSON               │
└──────────────┴───────────┴─────────────────────────────────────────┴────────────────────┘
\`\`\`
```

**Table rules:**
- ✅ supported, ⛔ not supported (NOT ❌ — renders poorly in Zed)
- Box-drawing chars: `┌ ┬ ┐ ├ ┼ ┤ └ ┴ ┘ │ ─`
- Wrap in triple backticks
- Add "Notes" column where helpful

### Step 3: Create Directory Structure

```bash
# Example for a tool called "newtool"
mkdir -p .newtool/rules .newtool/skills .newtool/agents

# Create config files (adjust based on tool's format)
echo '{}' > .newtool/settings.json
echo '{"mcpServers": {}}' > .newtool/mcp.json
touch .newtool/rules/.gitkeep
touch .newtool/skills/.gitkeep
touch .newtool/agents/.gitkeep
```

Only create directories for supported features.

### Step 4: Create Documentation

Create `docs/TOOLNAME.md`:

```markdown
# [Tool Name] Configuration Guide

> Detailed configuration reference for [Tool Name].

**Last Updated:** YYYY-MM-DD | **Source:** [docs.tool.com](https://docs.tool.com)

## Configuration Components

\`\`\`
┌──────────────┬───────────┬─────────────────────────────────────────┬────────────────────┐
│ Component    │ Supported │ Location                                │ Format             │
├──────────────┼───────────┼─────────────────────────────────────────┼────────────────────┤
│ Instructions │     ✅    │ AGENTS.md, .tool/rules/                 │ Markdown           │
│ Config       │     ✅    │ .tool/settings.json                     │ JSON               │
│ Rules        │     ⛔    │ -                                       │ -                  │
│ Skills       │     ✅    │ .tool/skills/                           │ Folder + SKILL.md  │
│ Hooks        │     ⛔    │ -                                       │ -                  │
│ Subagents    │     ⛔    │ -                                       │ -                  │
│ MCP          │     ✅    │ .tool/mcp.json                          │ JSON               │
└──────────────┴───────────┴─────────────────────────────────────────┴────────────────────┘
\`\`\`

---

## Directory Structure

\`\`\`
repo/
├── [instruction file]
└── .[tooldir]/
    ├── [config files]
    └── [subdirectories]
\`\`\`

## Configuration Priority (Highest to Lowest)

1. [First priority]
2. [Second priority]
...

## [Feature Sections]

[Details for each supported feature]

---

## Cross-Tool Compatibility

### What [Tool] Reads From Other Tools

\`\`\`
┌─────────────┬────────┬─────────────────────────────────┐
│ Source      │ Reads? │ Notes                           │
├─────────────┼────────┼─────────────────────────────────┤
│ AGENTS.md   │   ✅   │ Primary cross-tool instructions │
│ .claude/    │   ⛔   │ Not supported                   │
│ .cursor/    │   ⛔   │ Not supported                   │
│ .codex/     │   ⛔   │ Not supported                   │
└─────────────┴────────┴─────────────────────────────────┘
\`\`\`

### What Other Tools Read From [Tool]

\`\`\`
┌─────────────┬────────────────┬─────────────────────────┐
│ Tool        │ Reads .[tool]? │ Notes                   │
├─────────────┼────────────────┼─────────────────────────┤
│ Claude Code │       ⛔       │ Uses .claude/ only      │
│ Cursor      │       ✅       │ May read if compatible  │
│ Codex       │       ⛔       │ Uses AGENTS.md          │
│ Windsurf    │       ⛔       │ Uses .windsurf/         │
└─────────────┴────────────────┴─────────────────────────┘
\`\`\`
```

### Step 5: Verify Structure

```bash
# Show the new structure
find . -path './.git' -prune -o -type f -print | grep -v 'tsc-cache' | sort
```

## HeadoutAgentsConfig (this repository)

For **managed** skills, rules, or agents:
- Skills: `.claude/skills/<logical-name>-ho/SKILL.md` — frontmatter `name:` **without** `-ho`
- Rules: `.claude/rules/<name>-ho.md`
- Agents: `.claude/agents/<name>-ho.md`
- `install.sh` / `update.sh` copy paths verbatim into target repos

## Checklist

- [ ] Official docs researched
- [ ] Configuration Components table (ASCII box-drawing)
- [ ] Directory structure created (supported features only)
- [ ] Config files created (empty/placeholder)
- [ ] Documentation in `docs/TOOLNAME.md`
- [ ] Last Updated date + Source link in doc header
- [ ] ALL tables use ASCII box-drawing (no markdown tables)
- [ ] Cross-tool compatibility documented
- [ ] Used ⛔ (not ❌) for unsupported features
- [ ] Structure verified

## Notes

- Research official docs first — tools update frequently
- Configuration Components table is most important output
- ALL tables MUST use ASCII box-drawing (markdown tables render as CSV in terminals)
- ⛔ for "not supported" (never ❌)
- Focus on shareable vs tool-specific
- Document cross-tool compatibility
- Keep placeholder files minimal
