---
name: feature-interview
description: Interview user to create comprehensive feature specification (greenfield or brownfield)
---

# Feature Interview

Use before planning ANY significant feature for comprehensive requirements gathering.

## When to Use

- **Greenfield** (new project from scratch) - Full interview
- **Brownfield** (new feature in existing project) - Medium interview
- **Complex enhancement** with unclear requirements - Light interview
- **"Build me X"** without details - Clarify first

## Trigger Phrases

- "build me", "create", "new project", "new feature"
- "add feature", "implement"
- "I want to build", "help me create"

## How It Works

### 1. Invoke the Feature Interview Agent

```
Task(
  subagent_type="feature-interview-agent",
  prompt="""
  Conduct a feature interview for: {feature_description}

  Context provided by user: {any_context_from_conversation}

  Output: thoughts/shared/specs/SPEC-{feature-name}.md
  """
)
```

### 2. The Agent Will

1. **Detect context** - Ask if greenfield or brownfield
2. **Calibrate depth** - Adjust interview accordingly
3. **Ask structured questions** across categories:
   - Core Functionality (always)
   - Technical Requirements (greenfield/new features)
   - User Experience (if UI)
   - Edge Cases (always)
   - Testing Requirements (always)
   - Non-Functional (optional)
4. **Support delegation** - Accept "you decide" when user is fatigued
5. **Synthesize spec** - Create comprehensive SPEC document

### 3. After Interview

Spec created at: `thoughts/shared/specs/SPEC-{name}.md`

Typical flow:
```
/feature-interview → creates SPEC
        ↓
/create_plan → uses SPEC to create PLAN
        ↓
validate-agent → validates PLAN
        ↓
/implement_plan → implements with review loop
```

## Examples

### Greenfield Project
```
User: Build me a task management app

Claude: I'll start with a feature interview to understand your requirements.
[Invokes feature-interview-agent]
[Full interview: Core, Technical, UX, Edge Cases, Testing, Non-Functional]
[Creates thoughts/shared/specs/SPEC-task-management.md]
```

### Brownfield Feature
```
User: Add dark mode to the settings page

Claude: Before implementing, let me clarify some requirements.
[Invokes feature-interview-agent]
[Light interview: Core, Edge Cases]
[Creates thoughts/shared/specs/SPEC-dark-mode.md]
```

### User Delegation
```
Agent: What auth method would you prefer - JWT, sessions, or OAuth?
User: You decide

Agent: I recommend JWT because:
- Stateless (scales well)
- Standard for REST APIs
- Easy integration

I'll document this as a delegated decision.
```

## Output

Produces a SPEC document with:
- Overview and context
- Users and actors
- User flows (step by step)
- MVP vs nice-to-have features
- Technical decisions with rationale
- Architecture diagram (Mermaid)
- Edge cases and error handling
- Testing strategy (tier-aware)
- Open questions
- Delegated decisions

## Integration

After spec creation:
1. **Review** - User approves or requests changes
2. **Validate** - `validate-agent` checks decisions
3. **Plan** - `plan-agent` breaks into tasks
4. **Implement** - `implement_plan` with review loop

## Manual Invocation

```
/feature-interview {feature-name}
```

Or describe what you want to build — system will suggest this skill.
