---
description: Create implementation plans across multiple repositories (frontend, backend, infra, etc.) with full context and contract passing between repos
agent: build
---


# Multi-Repository Implementation Plan

Create implementation plans for PRDs/specs spanning multiple codebases. Each repo gets full-depth planning via `/create_plan`, with contracts (API endpoints, events, shared types) flowing from producer to consumer repos.

## When to Use

- PRD requires changes in multiple repositories
- Need coordinated planning across codebases with different tech stacks
- Changes in one repo define contracts other repos must consume

## When NOT to Use

- Single-repo changes → `/create_plan`
- Quick multi-repo fixes not needing formal planning
- Independent repos with no dependencies → run `/create_plan` separately

## Architecture

Uses **multiple context windows** via `/clear` for full planning depth per repo:

```
Context 1: Setup Interview
  └── Identify repos, types, decisions → Save planning brief

Context 2: Producer Repo Plan (e.g., backend)
  └── Full create_plan → Extract contracts → Save to brief

Context 3: Consumer Repo Plan (e.g., frontend)
  └── Load contracts → Full create_plan with contract context

Context 4: Review & Cross-Reference
  └── Load all plans → Verify dependencies → User approval
```

## State Persistence

All state in **planning brief directory**:

```
thoughts/shared/briefs/<feature-name>/
  ├── state.json              # Current phase, done/next
  ├── prd.md                  # Original PRD (copied once)
  ├── interview.md            # User decisions from setup
  ├── repos.json              # Repo paths, types, dependency order
  ├── contracts/
  │   ├── <repo>-api.md       # API endpoints, request/response shapes
  │   ├── <repo>-events.md    # Event names, payloads
  │   └── <repo>-types.md     # Shared types, enums
  └── summaries/
      └── <repo>-plan.md      # Plan summary for cross-reference
```

Written **incrementally** after every significant step.

---

## Phase 1: Setup Interview (Context 1)

### Step 1.1: Initial Response

When invoked with `/multi_repo_plan [PRD path]`:
- PRD path provided → read immediately and fully
- No PRD → ask user to provide or describe feature

Then detect current repo type and begin interview.

### Step 1.2: Repo Type Detection

```javascript
const REPO_TYPE_MARKERS = {
  'backend-go':     ['go.mod', 'cmd/', 'internal/'],
  'backend-node':   ['package.json', 'src/routes/', 'src/controllers/'],
  'backend-python': ['requirements.txt', 'app/', 'manage.py'],
  'frontend-react': ['package.json', 'src/components/', 'src/App.tsx'],
  'frontend-vue':   ['package.json', 'src/components/', 'vue.config.js'],
  'infra':          ['*.tf', 'terraform/', 'main.tf'],
  'mobile-rn':      ['package.json', 'App.tsx', 'ios/', 'android/'],
  'db-migrations':  ['migrations/', 'schema.sql', 'flyway.conf'],
};
```

Use `Glob` to check marker files.

### Step 1.3: Multi-Repo Interview

Use `AskUserQuestion` to gather:

1. **Repo Identification** — which repos, absolute paths, types
2. **Dependency Order** — who produces API contracts, who consumes, circular deps
3. **Cross-Repo Decisions** — auth approach, error handling, naming conventions
4. **Confirmation** — review full list and order before proceeding

### Step 1.4: Save Planning Brief

```bash
mkdir -p thoughts/shared/briefs/<feature-name>
```

**Write `state.json`:**
```json
{
  "feature": "booking-flow",
  "created": "2026-02-07T10:30:00Z",
  "updated": "2026-02-07T10:30:00Z",
  "phase": "setup_complete",
  "repos": [
    {"path": "/Users/user/backend-api", "type": "backend-go", "status": "pending"},
    {"path": "/Users/user/web-app", "type": "frontend-react", "status": "pending"}
  ],
  "current_repo_index": 0,
  "dependency_order": ["backend-api", "web-app"]
}
```

**Write `interview.md`:**
```markdown
# Interview Decisions: booking-flow
Date: 2026-02-07

## Repos
| Alias | Path | Type | Role |
|-------|------|------|------|
| backend-api | /Users/user/backend-api | backend-go | API producer |
| web-app | /Users/user/web-app | frontend-react | API consumer |

## Cross-Repo Decisions
- Auth: Use existing JWT middleware
- Error format: { error: string, code: string, details?: object }
- Naming: Use "booking" not "reservation" consistently

## PRD Summary
[Brief summary of what we're building]
```

Copy PRD to `prd.md`.

### Step 1.5: Transition

Check context usage:
- **>80%**: Tell user to `/clear` then say "continue multi repo plan"
- **≤80%**: Continue immediately to Phase 2

---

## Phase 2+: Per-Repo Planning

### Step 2.1: Detect Continuation

On `/multi_repo_plan --continue`:
1. Find `thoughts/shared/briefs/*/state.json`
2. Load state, interview decisions, existing contracts

No `--continue` but state.json exists with pending work → ask to continue.

### Step 2.2: Target Repo Directory

**CRITICAL**: Plan for each repo MUST be written inside THAT repo's directory.

Use **absolute paths** for all reads/writes targeting this repo. Plan saves to: `<target-repo-path>/thoughts/shared/plans/`

### Step 2.3: Invoke /create_plan

**CRITICAL**: Do NOT inline lightweight planning. Invoke actual `/create_plan` for full-depth planning per repo.

**CRITICAL**: Plan MUST go to **target repo's** `thoughts/shared/plans/`, NOT current repo. Create dir first: `mkdir -p <target-repo-path>/thoughts/shared/plans`

For consumer repos, compile all upstream contracts into constraints summary before invoking create_plan. Plan MUST match contracts exactly.

```
Skill("create_plan", args="thoughts/shared/briefs/<feature>/prd.md")
```

Remind create_plan to write to `<target-repo-absolute-path>/thoughts/shared/plans/YYYY-MM-DD-<description>.md`.

Each repo gets full `/create_plan` treatment: context gathering, research, deep interview, plan structure, detailed writing, review iteration.

### Step 2.4: Extract Contracts (producer repos)

**Write `contracts/<repo>-api.md`:**
```markdown
# API Contracts: backend-api
Extracted: 2026-02-07

## Endpoints

### POST /api/v1/bookings
Create a new booking.

**Request:**
```json
{
  "guest_name": "string",
  "date": "string (ISO 8601)",
  "product_id": "string (UUID)"
}
```

**Response (201):**
```json
{
  "id": "string (UUID)",
  "status": "pending" | "confirmed",
  "created_at": "string (ISO 8601)"
}
```

**Errors:**
- 400: `{ "error": "Invalid date", "code": "INVALID_DATE" }`
- 404: `{ "error": "Product not found", "code": "PRODUCT_NOT_FOUND" }`
```

**Write `contracts/<repo>-events.md`** similarly for events with payloads and consumer info.

### Step 2.5: Save Plan Summary

**Write `summaries/<repo>-plan.md`** with: plan path, phases list, key files changed, contracts produced, dependencies.

### Step 2.6: Update State & Transition

Update `state.json`: set repo status to "complete", increment `current_repo_index`.

Check context usage:
- **>80%**: Tell user to `/clear` then "continue multi repo plan"
- **≤80%**: Continue immediately to next repo

---

## Final Phase: Review & Cross-Reference

### Step 3.1: Load All Plans

Load all summaries, contracts, and original PRD.

### Step 3.2: Generate Cross-Reference

Present unified view with:
- Repo table (type, plan link, phase count)
- Dependency graph
- Execution order (what can parallelize, what blocks what)
- Contract verification checklist
- Implementation commands per repo

### Step 3.3: User Approval

Review: dependency ordering, contract definitions, missing repos/phases. Once approved, implement each plan via `/implement_plan` in each repo.

---

## State File Updates

Update **after every significant step**:

| Event | State Update |
|-------|--------------|
| PRD read | `phase: "prd_loaded"` |
| Repo identified | Add to `repos` array |
| Interview answered | Append to `interview.md` |
| Planning started | `repos[i].status: "in_progress"` |
| Contract extracted | `contracts_extracted: true` |
| Plan written | `repos[i].status: "complete"` |
| All repos done | `phase: "review"` |
| User approved | `phase: "complete"` |

---

## Invocation

```
/multi_repo_plan path/to/prd.md       # Start new
/multi_repo_plan                       # Will ask for PRD
/multi_repo_plan --continue            # Resume from state.json
/multi_repo_plan --continue booking-flow  # Resume specific feature
/multi_repo_plan --status              # Show state without continuing
```

## Error Recovery

- **User clears mid-phase**: State file has last checkpoint, resume with `--continue`
- **Repo path changed**: Update repos.json, run `--continue`
- **Re-plan a repo**: Set `repos[i].status: "pending"`, run `--continue`
