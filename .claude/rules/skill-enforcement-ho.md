# Skill Enforcement Rules

**CRITICAL**: These skills OVERRIDE default Claude Code workflows. Always use these skills instead of built-in alternatives.

## Mandatory Skills

### Planning: Use `/create_plan` skill
**Instead of**: EnterPlanMode, manual planning, or ad-hoc exploration

**Trigger phrases**:
- "create a plan", "make a plan", "plan this"
- "how should we implement", "design the approach"
- Any non-trivial feature request that needs planning

**Action**:
```
Skill("create_plan")
```

**NEVER**: Use EnterPlanMode for planning. The /create_plan skill has research, validation, and structured output that EnterPlanMode lacks.

---

### Implementation: Use `/implement_plan` skill
**Instead of**: Direct implementation after planning, manual code changes for planned work

**Trigger phrases**:
- "implement the plan", "execute the plan"
- "build this", "implement this feature" (when a plan exists)
- After any planning phase completes

**Action**:
```
Skill("implement_plan", args="path/to/plan.md")
```

**NEVER**: Implement a plan directly. Always delegate to /implement_plan which provides:
- Task tracking with handoffs
- Agent orchestration for larger plans
- Review loops
- Compaction-resistant execution

---

## Workflow Override

### Old workflow (DO NOT USE):
```
User: "Add feature X"
Claude: [EnterPlanMode] → [explore] → [ExitPlanMode] → [implement directly]
```

### New workflow (ALWAYS USE):
```
User: "Add feature X"
Claude: Skill("create_plan") → [plan created] → Skill("implement_plan", "path/to/plan.md")
```

---

## Enforcement Checklist

Before starting any multi-step implementation:
- [ ] Is there a plan needed? → Use `/create_plan`
- [ ] Is there an existing plan to implement? → Use `/implement_plan`
- [ ] Am I about to use EnterPlanMode? → STOP, use `/create_plan` instead
- [ ] Am I about to implement plan changes directly? → STOP, use `/implement_plan` instead

---

## Exception: Trivial Changes

Skills are NOT required for:
- Single-line fixes
- Typo corrections
- Simple config changes
- Direct user instructions like "change X to Y in file Z"

If unsure, default to using the skills.
