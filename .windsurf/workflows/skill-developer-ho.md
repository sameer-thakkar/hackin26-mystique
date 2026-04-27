
# Skill Developer

Meta-skill for creating new Claude Code skills, including MCP pipeline wrappers.

## When to Use

- "Create a skill for X"
- "Help me make a new skill"
- "Turn this script into a skill"
- "How do I create a skill?"

## Skill Structure

Skills live in `.claude/skills/<skill-name>/`:

```
.claude/skills/my-skill/
├── SKILL.md          # Required: Main skill definition
├── scripts/          # Optional: Supporting scripts
└── templates/        # Optional: Templates, examples
```

### SKILL.md Format

```yaml
---
name: skill-name
description: Brief description (shown in skill list)
---

# Skill Name

## When to Use
[When Claude should discover this skill]

## Instructions
[Step-by-step instructions for Claude to follow]

## Examples
[Usage examples]
```

## Skill Triggers (Advanced - Optional)

If your org uses skill-rules.json for auto-suggestions, add triggers:

```json
{
  "skills": {
    "my-pipeline": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "medium",
      "description": "What it does",
      "promptTriggers": {
        "keywords": ["keyword1", "keyword2"],
        "intentPatterns": ["(pattern).*?(match)"]
      }
    }
  }
}
```

Note: Requires a UserPromptSubmit hook to read and process skill-rules.json.

## Reference Files

For full details, read rules in `.claude/rules/`:
- `skill-development.md` - Skill structure and best practices
- `mcp-scripts.md` - MCP script patterns (if using MCP tools)

## Quick Checklist

- [ ] SKILL.md has frontmatter (name, description)
- [ ] "When to Use" section is clear
- [ ] Instructions are copy-paste ready
- [ ] External dependencies documented if needed

## Examples in This Repo

```bash
ls .claude/skills/
cat .claude/skills/commit-ho/SKILL.md
cat .claude/skills/create_plan-ho/SKILL.md
```
