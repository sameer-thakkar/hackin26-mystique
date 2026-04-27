# Phase 6: Feedback & Finalization (5 minutes)

**USER FEEDBACK REQUIRED - Component not complete until user approves.**

## Step 1: Component Demonstration

Present the completed component with:

```typescript
const implementationSummary = {
  componentType: '[Name]',
  atomsUsed: ['Button', 'Text', 'Icon', 'Box'],
  variantsImplemented: [],
  technicalDecisions: {
    portal: 'Used createPortal if overlay',
    refs: 'Used div ref if needed (Box does not accept refs)',
    accessibility: 'ARIA attributes, focus trapping, keyboard navigation',
    typeGuards: 'Type guards for Button atom prop requirements'
  },
  filesCreated: [
    'types.ts - TypeScript definitions with T prefix types',
    'styles.ts - PandaCSS with design tokens only',
    'Component.tsx - React implementation with atoms and Icon wrapper',
    'index.ts - Clean exports',
    'Component.stories.tsx - Design system compliant Storybook',
    'FIGMA_ANALYSIS.md - Comprehensive Figma documentation'
  ]
};
```

## Step 2: Ask for Feedback with Visual Verification

Present to the user:

**Implemented:**
- All variants and features
- All atoms used and how
- Accessibility features
- Responsive behavior (if applicable)

**Technical Decisions Made:**
- Ref usage, portal usage, atom integration, any complex logic

**Visual Comparison:**
Ask the user to provide a screenshot of the running component for pixel-perfect comparison with the Figma reference.

**Questions for the user:**
1. Does the component behavior match expectations?
2. Are all variants working correctly?
3. Is the responsive behavior appropriate?
4. Any changes needed to the API or props?
5. Should any styling or interactions be adjusted?
6. Can you provide a screenshot for visual comparison?

## Step 3: Visual Comparison Analysis

When user provides screenshot:
```typescript
const visualComparison = await Read({ file_path: 'user-screenshot.png' });
const figmaReference = await Read({ file_path: './assets/component-reference.png' });

// Compare: color differences, spacing/alignment, font styling,
// icon positioning, missing visual elements, border radius, shadows
```

## Step 4: Iteration Based on Feedback

- [ ] Address functionality issues
- [ ] Fix visual discrepancies from screenshot comparison
- [ ] Adjust styling if needed
- [ ] Modify props or API if requested
- [ ] Add missing variants or states
- [ ] Fix accessibility issues if found
- [ ] Update documentation based on feedback
- [ ] Re-verify with new screenshot if changes made

## Step 5: Create Progress Tracking

Create `COMPONENT_CREATION_PROGRESS.md`:

```markdown
# Component: [Name] - Progress

## Status: COMPLETED

## Implementation Checklist:
- [x] Figma analysis complete
- [x] Design tokens mapped
- [x] Types created (T prefix)
- [x] Styles implemented (PandaCSS tokens)
- [x] Component built (atoms, Icon wrapper)
- [x] Exports configured
- [x] Accessibility verified
- [x] Tests written
- [x] Stories follow design system rules
- [x] FIGMA_ANALYSIS.md created

## Files Created:
[List all files]

## Design Decisions:
[Document key decisions]
```

**COMPONENT NOT COMPLETE UNTIL USER APPROVES BOTH FUNCTIONALITY AND VISUAL ACCURACY.**
