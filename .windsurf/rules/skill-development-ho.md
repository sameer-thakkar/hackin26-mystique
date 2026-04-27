---
trigger: always_on
description: Skill Development Rules
---

---
globs: [".claude/skills/**/*"]
---

# Skill Development Rules

When working with files in `.claude/skills/`:

## HeadoutAgentsConfig layout

- Managed skill directories in this repo are **`<logical-name>-ho/`**. Keep YAML `name:` as the logical name **without** `-ho`. `skill-rules.json` is not prefixed.

## SKILL.md Structure

```yaml
---
name: skill-name
description: Brief description
allowed-tools: [Bash, Read]  # Optional: restrict tools
---
```

## DO
- Keep SKILL.md concise (< 200 lines)
- Include clear "When to Use" section
- Provide copy-paste bash commands
- Document any external dependencies
- Use descriptive skill directory names

## DON'T
- Include implementation details in SKILL.md
- Duplicate content across skills
- Use allowed-tools that aren't needed
- Assume external tools/MCP servers are available

## Optional: MCP Wrapper Skills
For skills that wrap MCP tools (when configured):
- Use `allowed-tools: [Bash, Read]` to restrict capabilities
- Document required MCP server in skill header
- Include parameter documentation
