
# Eevee Component Creation Workflow

**Senior software engineer** role with deep expertise in React, TypeScript, design systems, PandaCSS, and engineering best practices. Prioritize quality, developer experience, performance, and accessibility.

## Purpose

Create production-ready components using Eevee design system with:
- PandaCSS via `@headout/pixie`
- Figma extraction via Framelink MCP
- External patterns via Context7 MCP
- Design tokens via Oak CLI (`/oak-cli` skill — must be installed)

## Required Tools

**Oak CLI (prefetch at start):**
```bash
oak styles list                    # Complete text style catalog
oak tokens category colors         # All color tokens
oak components list                # Available Eevee components and atoms
```

**Oak CLI (fetch as needed):**
```bash
oak tokens category spacing        # spacing, shadows, radii tokens
oak tokens get "token.name"        # Specific token lookup
oak tokens find "#hex"             # Reverse lookup by CSS value
oak icons get IconName             # Verify icon paths
oak icons list --category name     # Browse icons by category
```

**Figma MCP (fetch as needed):**
- `get_figma_data({ fileKey, nodeId })` - Extract Figma designs
- `download_figma_images({ fileKey, nodes })` - Download assets

## Workflow Phases

**IMPORTANT: Read one phase file at a time. Do NOT read all phases upfront.**

| Phase | Name | Duration | File | User Gate |
|-------|------|----------|------|-----------|
| 0 | Planning & Analysis | 10 min | [phase-0-planning.md](phases/phase-0-planning.md) | USER Q&A REQUIRED |
| 1 | Layout Planning & Approval | 8 min | [phase-1-layout.md](phases/phase-1-layout.md) | USER APPROVAL REQUIRED |
| 2 | Research & Foundation | 3 min | [phase-2-research.md](phases/phase-2-research.md) | - |
| 3 | Asset Extraction | 4 min | [phase-3-assets.md](phases/phase-3-assets.md) | - |
| 4 | Implementation | 15-25 min | [phase-4-implementation.md](phases/phase-4-implementation.md) | - |
| 5 | Quality & Validation | 5 min | [phase-5-quality.md](phases/phase-5-quality.md) | - |
| 6 | Feedback & Finalization | 5 min | [phase-6-feedback.md](phases/phase-6-feedback.md) | USER FEEDBACK REQUIRED |

**Total: 50-65 minutes** (simple=50min, complex with subcomponents=65min)

## Execution

1. **Start**: Read [phase-0-planning.md](phases/phase-0-planning.md) and prefetch design system data via Oak CLI in parallel
2. **Progress**: After each phase, read next phase file
3. **Gates**: Phases 0, 1, and 6 require user interaction
4. **Templates**: Use files in [templates/](templates/) during Phase 4
5. **Reference**: Consult [conventions.md](reference/conventions.md) for naming and token patterns

## File Structure Output

```
ComponentName/
├── index.ts              # Exports
├── ComponentName.tsx     # React implementation
├── types.ts              # TypeScript definitions (T prefix)
├── styles.ts             # PandaCSS recipes with design tokens
├── ComponentName.test.tsx # Unit tests
├── ComponentName.stories.tsx # Storybook stories (design system compliant)
├── FIGMA_ANALYSIS.md     # Figma documentation & token mapping
└── assets/               # Downloaded Figma references
```

## Quick Reference

For critical rules on atoms, tokens, icons, and common pitfalls, see [conventions.md](reference/conventions.md).
