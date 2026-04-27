---
name: deploy-non-prod-ho
description: Deploy Headout services to test/ODE environments
---

# Deploy Non-Production (Headout)

Safe, repo-aware deployment to **test** and **ODE preview environments** only. Production intentionally not supported.

## When to Use

- "deploy my current branch" / "deploy to test" / "deploy to ode final"
- "deploy hub-frontend to test" / "list ode services" / "check ode status"

## Core Capabilities

1. **Repo-aware**: Auto-detects service from repo metadata, uses current commit
2. **Explicit**: Specify service name and commit/version from anywhere
3. **ODE Management**: List/create/delete ODEs, check status, upscale dormant envs, share access

## Supported Environments

- `test` - Shared test environment
- `ode` - Preview environments (e.g., "final", "my-preview")

> Production is NOT supported

## Instructions

### Pre-requisite: Shell Alias

Add to `~/.zshrc` or `~/.bashrc`:
```bash
# Option 1: If CLAUDE_PROJECT_DIR is set (recommended)
alias deploy-non-prod-ho="$CLAUDE_PROJECT_DIR/.claude/skills/deploy-non-prod-ho/scripts/deploy-non-prod-ho.sh"

# Option 2: Replace with your actual clone path
# alias deploy-non-prod-ho="/path/to/your/headout-agent-config/.claude/skills/deploy-non-prod-ho/scripts/deploy-non-prod-ho.sh"
```

Reload: `source ~/.zshrc` (or `source ~/.bashrc`)

All commands use alias `deploy-non-prod-ho`, NOT full path.

### Deployment Workflow

#### Repo-aware Mode (Inside Service Repo)

```bash
# Deploy current commit to test
deploy-non-prod-ho --env test

# Deploy current commit to ODE
deploy-non-prod-ho --ode <ode-name>
```

**Flow:**
1. Verify git repo
2. Resolve commit: `git rev-parse --short HEAD`
3. Infer service from repo name, package.json, deploy/app yaml
4. Ambiguous → **ask user**
5. Validate service exists
6. Check build availability
7. Confirm with user
8. Deploy

#### Explicit Mode (Any Service)

```bash
# Deploy specific service and commit to test
deploy-non-prod-ho hub-frontend 7ec56d5 --env test

# Deploy to ODE (using commit hash)
deploy-non-prod-ho hub-frontend abc1234 --ode my-preview
```

### Service Validation (CRITICAL)

Before EVERY deployment:

```bash
# Verify service exists
deploy-non-prod-ho --list-services <environment>
```

Service not found → **Service Resolution Mode**:
1. Fuzzy match available services
2. Present ranked candidates
3. Wait for explicit selection
4. Never auto-select

### Build Availability Check

```bash
# Check available builds
deploy-non-prod-ho --list-builds <service>
```

If commit missing:
1. Check GitHub Actions for build status
2. **In progress** → inform user, exit
3. **Not found** → inform user commit not pushed, exit
4. Only proceed if build **READY**

### Discovery Commands

```bash
# List services in an environment
deploy-non-prod-ho --list-services test
deploy-non-prod-ho --list-services ode

# List available builds for a service
deploy-non-prod-ho --list-builds hub-frontend

# ODE discovery
deploy-non-prod-ho --list-ode-namespaces
deploy-non-prod-ho --list-ode-services
deploy-non-prod-ho --ode-status final
deploy-non-prod-ho --ode-dependencies hub-frontend
```

### ODE Lifecycle

```bash
# Wake up dormant ODE
deploy-non-prod-ho --upscale <ode-name>

# Create new ODE (ALWAYS check dependencies first!)
# Step 1: Check dependencies for the service
deploy-non-prod-ho --ode-dependencies <service-name>

# Step 2: Create ODE with service + all dependencies
deploy-non-prod-ho --create-ode <ode-name> <service1,service2,...> <version>

# Delete ODE
deploy-non-prod-ho --delete-ode <ode-name>

# Share ODE access with a teammate
deploy-non-prod-ho --share-ode <ode-name> <email@headout.com>
```

### Authentication

```bash
# Set authentication cookie
deploy-non-prod-ho --set-cookie <cookie-value>

# Show stored cookies
deploy-non-prod-ho --show-cookies
```

## Rules

1. Default commit: `git rev-parse --short HEAD`
2. Infer service when possible, ask when ambiguous
3. Validate service existence before deploying
4. Enter resolution mode if not found
5. Check build availability via GitHub Actions if needed
6. Require confirmation before deploying
7. Never infer environments (test vs ode)
8. Never auto-confirm
9. Never alter script behavior
10. Always send 'y' to script prompts after user confirms
11. Always check dependencies before creating ODE

## User Confirmation Flow

When user says "deploy my current branch":
1. Show:
   ```
   Service: hub-frontend
   Commit: 7ec56d5
   Environment: test
   ```
2. Ask: "Proceed with deployment?"
3. If confirmed → `yes | script.sh ...`
4. Stream output

## ODE Creation Workflow

1. Check dependencies: `deploy-non-prod-ho --ode-dependencies <service>`
2. Show:
   ```
   ODE Name: my-ode
   Services:
     - hub-frontend (primary)
     - calipso (dependency)
     - hub-backend (dependency)
     - oberon (dependency)
     - aries (dependency)
     - headout-guardian-service (dependency)
     - athena (dependency)
   Version: latest
   ```
3. Ask: "Proceed with ODE creation?"
4. If confirmed → `deploy-non-prod-ho --create-ode my-ode hub-frontend,calipso,hub-backend,oberon,aries,headout-guardian-service,athena latest`

## Service Resolution Example

```
Service 'mmp-builder' not found in ODE 'final'.

Did you mean:
1. headout-mmp-suite (90% match)
2. headout-mmp-frontend (75% match)
3. headout-mmp-backend (70% match)

Reply with number or exact name.
```

## Safety Guarantees

- Uses script exactly as-is
- Never mutates payloads or hides output
- Never deploys without confirmation
- Never switches services silently
- Converts failures into guided decisions
