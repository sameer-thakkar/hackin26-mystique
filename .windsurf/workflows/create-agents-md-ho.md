
# Create AGENTS.md & Agent Configuration

Generate agent instruction files following best practices from Anthropic, Vercel, HumanLayer, Builder.io, Dometrain, AI Hero, and the AGENTS.md open spec.

## When to Use

- Setting up new repo for AI agents
- Replacing outdated CLAUDE.md / AGENTS.md
- Onboarding codebase for Claude Code, Codex, Cursor, or other AI tools
- User says "create agents.md", "setup claude.md", "configure agent files"

## Best Practices Reference

### Source 1: Anthropic Official
- Docs: https://code.claude.com/docs/en/best-practices
- Memory: https://code.claude.com/docs/en/memory
- Blog: https://claude.com/blog/using-claude-md-files
- Principle: "For each line, ask: Would removing this cause mistakes? If not, cut it."
- Include: Commands agents can't guess, non-default code style, env quirks, gotchas
- Exclude: Code-inferable info, standard conventions, detailed API docs, frequently-changing info
- Use `@import` for detailed docs; path-scoped rules in `.claude/rules/`

### Source 2: Vercel (100% pass rate benchmark)
- Blog: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
- Static docs: 100% pass rate vs 79% skills vs 53% baseline
- Compressed docs index: 80% size reduction, same performance
- Directive: "Prefer retrieval-led reasoning over pre-training-led reasoning"
- Pipe/arrow-delimited index pointing to retrievable files
- Passive context (always loaded) beats dynamic context

### Source 3: HumanLayer
- Blog: https://www.humanlayer.dev/blog/writing-a-good-claude-md
- Structure: WHAT (tech stack) / WHY (purpose) / HOW (workflow, verification)
- Root file under 60 lines
- "Never send an LLM to do a linter's job"
- "Prefer pointers to copies" — file:line refs over snippets
- Progressive disclosure via separate referenced docs

### Source 4: Builder.io
- Blog: https://www.builder.io/blog/claude-md-guide
- "Gotchas" section is underrated
- Subdirectory CLAUDE.md for monorepos (auto-loaded)
- CLAUDE.local.md for personal prefs (gitignored)
- Iterative refinement: update based on observed failures
- Under 300 lines root file

### Source 5: Dometrain
- Blog: https://dometrain.com/blog/creating-the-perfect-claudemd-for-claude-code/
- Numbered step-by-step workflows for recurring tasks
- Explicit CLI parameter docs
- Monorepo: document command execution directories
- Terminology section for domain jargon
- Test-specific conventions

### Source 6: AI Hero
- Blog: https://www.aihero.dev/a-complete-guide-to-agents-md
- Minimal root: "one-sentence description + package manager + build commands"
- Token budget: ~150-200 instructions max
- Domain-specific rules in separate files
- Refactoring prompt for periodic auditing

### Source 7: AGENTS.md Open Spec
- Spec: https://agents.md/
- Standard markdown, no required fields
- 20+ tools support it (Codex, Cursor, Copilot, Devin, Jules, etc.)
- Nested files for monorepos (closest takes precedence)
- 60,000+ open-source projects use it

### Anti-Patterns (ALL sources agree — NEVER do these)
1. Kitchen sink — too long, important rules get lost
2. Linter substitute — use deterministic tools
3. Code snippets — go stale, use file:line refs
4. Auto-generated without curation
5. Stale documentation — outdated info actively hurts
6. Excessive MCP config — >20K tokens cripples agents
7. Self-evident practices — "write clean code" wastes tokens
8. Secrets or env var values
9. Frequently-changing info — belongs in code/config
10. Standard language conventions — agents know these

## Execution Steps

Use subagents for exploration to preserve context.

### Phase 1: Explore Repository

Use subagent to gather:

1. **Directory structure** — layout, monorepo structure
2. **Tech stack** — languages, frameworks, databases, package managers
3. **Build system** — key commands
4. **Package files** — package.json, go.mod, Cargo.toml, requirements.txt, etc.
5. **Test setup** — frameworks, config, naming conventions, single test commands
6. **Config system** — env vars, config files, loading mechanism
7. **CI/CD** — Actions, deployment configs, containers
8. **Architecture** — DI, middleware, module organization, API patterns
9. **RPC/API style** — REST, GraphQL, gRPC, Twirp
10. **Auth system** — authentication/authorization approach
11. **Key conventions** — logging, error handling, imports
12. **Existing docs** — README, setup guides, architecture docs
13. **Domain terminology** — project terms, service names, acronyms
14. **Gotchas** — config quirks, build oddities, common pitfalls

### Phase 2: Create Root AGENTS.md

```markdown
# Project Name

> One-sentence description: what it is, what tech, what it does.

IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning. Always READ the actual code and config files before making assumptions.

## Monorepo Structure (if applicable)
[Directory map with arrow descriptions — keep it scannable]

## Tech Stack
[Table format: Component | Stack]

## Package Managers
[Which package manager for which component. Call out non-obvious ones.]

## Key Commands
[Grouped by component. Include working directory. Exact commands only.]

## Configuration
[How config works. Env vars. Important: any build-time vs runtime distinction.]

## Architecture Patterns
[Brief: DI pattern, API style, middleware, data fetching. Pointers not copies.]

## Git Conventions
[Commit format, branch naming, PR process]

## Gotchas
[Bulleted list of things agents WILL get wrong without explicit warning]

## Rules Index
[List of .claude/rules/ files with one-line descriptions]
[List of subdirectory AGENTS.md files if they exist]

## Docs Index
[Pointer to key files agents should READ when they need detail]
[Format: file/path → one-line description of what's in it]

## Terminology
[Table: Term | Meaning — domain-specific jargon mapped to code]
```

### Phase 3: Create .claude/rules/ Files

One file per major topic:

- **Language/framework rules** — patterns, conventions, DI, error handling
- **API/RPC rules** — endpoints, how to add new ones
- **Frontend rules** (if applicable) — UI library, state, routing
- **Infrastructure rules** (if applicable) — CI/CD, Docker, deployment
- **Terminology** — full glossary
- **Workflows** — numbered step-by-step procedures

Each rule file:
- Start with `# Title` and one-line "When to use" trigger
- 70-120 lines max
- Tables and code blocks for scannability
- Reference actual file paths
- Include exact patterns from codebase

### Phase 4: Create Subdirectory AGENTS.md (Monorepos)

Per major component directory:
- Quick reference commands
- Directory structure
- Component-specific patterns and gotchas

### Phase 5: Create Symlinks

```bash
# Root CLAUDE.md symlink (for tools that look at repo root)
rm -f CLAUDE.md
ln -s AGENTS.md CLAUDE.md

# .claude/CLAUDE.md symlink (for Claude Code which looks in .claude/)
mkdir -p .claude
rm -f .claude/CLAUDE.md
ln -s ../AGENTS.md .claude/CLAUDE.md
```

Ensures single source of truth — Claude Code, Codex, Cursor, Copilot all read same content.

### Phase 6: Verify

- Confirm symlink: `ls -la .claude/CLAUDE.md`
- List created files with line counts
- Present summary table

## Output Format

After creating all files:
1. Table of files created with line counts and purpose
2. List of standards applied
3. Suggestion: "Review and refine based on observed agent behavior"
